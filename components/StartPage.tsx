"use client";

import { useState, useEffect } from "react";

import { getUserData, saveUserLocation, addWidget } from "@/app/actions/user-actions";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Weather } from "@/app/widgets/Weather";

function mapWidgetToComponent(widget: any) {
    switch (widget.widget) {
        case "weather":
            return <Weather key={widget.widget_id} widgetData={widget.widget_options} />;
        default:
            return null;
    }
}

type UserData = {
  user_location: string | null;
  added_widgets: object[] | null;
};

export function StartPage() {
    const [userData, setUserData] = useState<UserData | null>(null);
    useEffect(() => {
        getUserData().then((data) => {
            setUserData(data);
        });
    }, []);

    const widgets = userData?.added_widgets || []
    const widgetComponents = widgets.map((widget: any) => mapWidgetToComponent(widget));

    return (
        <div>
            <h1>StartPage</h1>
            <div className="flex flex-col gap-6">
                {widgetComponents}
            </div>
            <Input type="text" value={userData?.user_location || ""} onChange={(e) => setUserData({ ...userData, user_location: e.target.value } as UserData)} />
            <Button onClick={() => saveUserLocation(userData?.user_location || "")}>Save Location</Button>
            <Button onClick={() => getUserData()}>Get User Data</Button>
            <Button onClick={() => addWidget("weather", {location: userData?.user_location || ""})}>Add Weather Widget</Button>
        </div>
    );
}