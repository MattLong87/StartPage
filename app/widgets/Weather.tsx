export function Weather({widgetData}: {widgetData: any}) {

    const location = widgetData.location;
    return (
      <div className="bg-muted rounded-md p-6 my-6 relative">
        Weather Widget
        <p>Location: {location}</p>
        <p>widgetData: {JSON.stringify(widgetData)}</p>
      </div>
    );
  }