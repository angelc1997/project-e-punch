"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/utils/firebase";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

interface Location {
  latitude: number;
  longitude: number;
}

const FakeCompanyLocation: Location = {
  latitude: 25.0123456,
  longitude: 121.0123456,
};

const Allowed_distance = 100;
const WorkingEarlistStart = 8;
const WorkingLatestStart = 10;
const MinimiumWorkingTime = 9;

const EmployeeMainContent: React.FC = () => {
  const [status, setStatus] = useState<"in" | "out">("out");
  const [currentTime, setCurrentTime] = useState<string>("");
  const [checkClockIn, setCheckClockIn] = useState<string | null>(null);
  const [checkClockOut, setCheckClockOut] = useState<string | null>(null);
  const [checkExpectOut, setCheckExpectOut] = useState<string | null>(null);
  const [isLate, setIsLate] = useState(false);
  const [isEarly, setIsEarly] = useState(false);
  const [isOverTime, setIsOverTime] = useState(false);
  const [location, setLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hasClickedIn, setHasClickedIn] = useState(false);
  const [hasClickedOut, setHasClickedOut] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setLocationError("無法取得位置訊息");
        }
      );
    } else {
      setLocationError("無法支援地理定位");
    }

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("zh-TW", { hour12: true }));
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/signup";
      } else {
        const dateString = new Date().toISOString().split("T")[0];
        const docRef = doc(db, "users", user.uid, "records", dateString);

        const snapshot = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setCheckClockIn(data.clockInTime || null);
            setCheckClockOut(data.clockOutTime || null);
            setCheckExpectOut(data.expectOutTime || null);
            setStatus(data.clockOutTime ? "out" : "in");
            setHasClickedIn(!!data.clockInTime);
            setHasClickedOut(!!data.clockOutTime);
            setIsLate(data.isLate || false);
            setIsEarly(data.isEarly || false);
            setIsOverTime(data.isOverTime || false);
          } else {
            resetState();
          }
        });

        return () => snapshot();
      }
    });

    return () => unsubscribe();
  }, []);

  const resetState = () => {
    setCheckClockIn(null);
    setCheckClockOut(null);
    setCheckExpectOut(null);
    setStatus("out");
    setHasClickedIn(false);
    setHasClickedOut(false);
    setIsLate(false);
    setIsEarly(false);
    setIsOverTime(false);
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isInAllowedDistance = (): boolean => {
    if (!location) return false;
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      FakeCompanyLocation.latitude,
      FakeCompanyLocation.longitude
    );
    return distance <= Allowed_distance;
  };

  const calculateExpectedClockOut = (clockInTime: string): string => {
    const [inHours, inMinutes] = clockInTime.split(":").map(Number);

    if (inHours < WorkingEarlistStart) {
      return "17:00";
    } else if (inHours >= WorkingLatestStart) {
      return "19:00";
    } else {
      let outHours = inHours + MinimiumWorkingTime;
      let outMinutes = inMinutes;

      if (outHours >= 24) {
        outHours -= 24;
      }

      return `${outHours.toString().padStart(2, "0")}:${outMinutes
        .toString()
        .padStart(2, "0")}`;
    }
  };
  const handleClockIn = async () => {
    if (!isInAllowedDistance()) {
      alert("您不在允許打卡範圍內。");
      return;
    }
    const now = new Date();
    const clockInTime = now.toLocaleTimeString("zh-TW", { hour12: false });
    const expectedOutTime = calculateExpectedClockOut(clockInTime);
    const isLateAtClockIn = now.getHours() >= WorkingLatestStart;

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("使用者資訊不存在");

      const dateString = now.toISOString().split("T")[0];
      await setDoc(doc(db, "users", user.uid, "records", dateString), {
        clockInTime,
        clockOutTime: null,
        expectOutTime: expectedOutTime,
        clockInStatus: "in",
        clockOutStatus: null,
        isLate: isLateAtClockIn,
        userId: user.uid,
        date: dateString,
      });
    } catch (error) {
      console.error("打卡記錄保存失敗:", error);
    }
  };

  const calculateOverTime = (
    expectClockOutTime: string,
    actualClockOutTime: string
  ): { isEarly: boolean; isOverTime: boolean } => {
    return {
      isEarly: actualClockOutTime < expectClockOutTime,
      isOverTime: actualClockOutTime > expectClockOutTime,
    };
  };

  const handleClockOut = async () => {
    if (!checkClockIn || !checkExpectOut) {
      alert("無上班紀錄");
      return;
    }

    const now = new Date();
    const clockOutTime = now.toLocaleTimeString("zh-TW", { hour12: false });

    const { isEarly, isOverTime } = calculateOverTime(
      checkExpectOut,
      clockOutTime
    );

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("使用者資訊不存在");

      const dateString = now.toISOString().split("T")[0];
      await updateDoc(doc(db, "users", user.uid, "records", dateString), {
        clockOutStatus: "out",
        clockOutTime,
        isEarly,
        isOverTime,
      });
    } catch (error) {
      console.error("打卡記錄保存失敗:", error);
    }
  };

  return (
    <>
      <div className="">
        <Card className="">
          <CardHeader>日期</CardHeader>
          <CardContent>{new Date().toLocaleDateString()}</CardContent>
        </Card>
        <Card className="">
          <CardHeader>現在時間</CardHeader>
          <CardContent>{currentTime}</CardContent>
        </Card>
        <Card className="">
          <CardHeader>位置</CardHeader>
          <CardContent>
            {locationError ? (
              <Alert>
                <AlertTitle>錯誤</AlertTitle>
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            ) : (
              <p>
                緯度：{location?.latitude} 經度：{location?.longitude}
              </p>
            )}
          </CardContent>
        </Card>

        <Button onClick={handleClockIn} disabled={hasClickedIn}>
          上班打卡
        </Button>
        <Button
          onClick={handleClockOut}
          disabled={!checkClockIn || hasClickedOut}
        >
          下班打卡
        </Button>

        <Card>
          <CardHeader>今日打卡紀錄</CardHeader>
          <CardContent>
            {WorkingEarlistStart}:00 - {WorkingLatestStart}:00
            <CardDescription>表定上班時間</CardDescription>
          </CardContent>
          <CardContent>
            {WorkingEarlistStart + MinimiumWorkingTime}:00 -{" "}
            {WorkingLatestStart + MinimiumWorkingTime}:00
            <CardDescription>表定下班時間</CardDescription>
          </CardContent>
          <CardContent>
            <p>
              上班：
              {checkClockIn || "尚未打卡"}
            </p>
            <CardDescription>
              {isLate ? "今日超出打卡時間，請記得補單。" : ""}
            </CardDescription>
          </CardContent>
          <CardContent>
            <p>
              預計下班時間：
              {checkExpectOut || "尚未打卡"}
            </p>
            <CardDescription></CardDescription>
          </CardContent>
          <CardContent>
            <p>
              下班：
              {checkClockOut || "尚未打卡"}
            </p>
            <CardDescription>
              {isEarly ? "您提早打卡下班，請記得補單" : ""}
              {isOverTime ? "您超過下班時間，請記得補單" : ""}
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default EmployeeMainContent;
