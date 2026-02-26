import { WidgetCard } from "@/components/WidgetCard";
export function Weather({ widgetData }: { widgetData: any }) {

    const location = widgetData.location;
    return (
        <WidgetCard title="Weather">
            <div className="">
                Weather Widget
                <p>Location: {location}</p>
                <p>widgetData: {JSON.stringify(widgetData)}</p>
            </div>
        </WidgetCard>
    );
}