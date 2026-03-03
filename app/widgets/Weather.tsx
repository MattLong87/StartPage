import { WidgetCard } from "@/components/WidgetCard";
export function Weather({ widgetOptions }: { widgetOptions: any }) {

    const location = widgetOptions.location;
    return (
        <WidgetCard title="Weather">
            <div className="">
                Weather Widget
                <p>Location: {location}</p>
                <p>widgetOptions: {JSON.stringify(widgetOptions)}</p>
            </div>
        </WidgetCard>
    );
}