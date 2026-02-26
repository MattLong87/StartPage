export function WidgetCard({ children, title }: { children: React.ReactNode, title: string }) {

    return (
        <div>
            <h2 className="text-sm font-bold uppercase">{title}</h2>
            <div className="border-solid border-2 border-gray-300 rounded-md p-6  relative">
                {children}
            </div>
        </div>
    );
}