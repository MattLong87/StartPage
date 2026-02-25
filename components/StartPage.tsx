"use client";

import { useState, useEffect } from "react";

import { getUserData, saveUserLocation, addWidget } from "@/app/actions/user-actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type UserData = {
  user_location: string | null;
};

export function StartPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    useEffect(() => {
        getUserData().then((data) => {
            setUserData(data);
        });
    }, []);

    return (
        <div>
            <h1>StartPage</h1>
            <p>{JSON.stringify(userData)}</p>
            <Input type="text" value={userData?.user_location || ""} onChange={(e) => setUserData({ ...userData, user_location: e.target.value })} />
            <Button onClick={() => saveUserLocation(userData?.user_location || "")}>Save Location</Button>
            <Button onClick={() => getUserData()}>Get User Data</Button>
            <Button onClick={() => addWidget("weather", {location: userData?.user_location || ""})}>Add Weather Widget</Button>
        </div>
    );
}