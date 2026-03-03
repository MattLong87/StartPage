"use client";

import { useEffect, useRef, useState } from "react";
import { WidgetCard } from "@/components/WidgetCard";
import { updateWidget, loadWidget } from "@/app/actions/user-actions";

type SaveState = "idle" | "saving" | "saved" | "error";

export function ScratchPad({widgetId}: {widgetId: string}) {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const lastSavedTextRef = useRef("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeWidget = async () => {
      setIsLoading(true);
      try {
        const loadedOptions = await loadWidget("scratchpad", widgetId);
        const loadedText = loadedOptions?.text || '';

        if (!isMounted) {
          return;
        }

        setText(loadedText);
        lastSavedTextRef.current = loadedText;
        setSaveState("idle");
      } catch {
        if (!isMounted) {
          return;
        }
        setText('');
        lastSavedTextRef.current = '';
        setSaveState("error");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeWidget();

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [widgetId]);

  const saveText = async (nextText: string) => {
    setSaveState("saving");
    try {
      await updateWidget("scratchpad", widgetId, { text: nextText });
      lastSavedTextRef.current = nextText;
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  };

  useEffect(() => {
    if (text === lastSavedTextRef.current) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      void saveText(text);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, widgetId]);

  const handleBlur = () => {
    if (text === lastSavedTextRef.current) {
      return;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    void saveText(text);
  };

  return (
    <WidgetCard title="ScratchPad">
      <div className="space-y-2">
        {!isLoading && <textarea
          className="w-full min-h-32 rounded-md border border-gray-300 p-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          placeholder="Write a note..."
        />}
        <p className="text-xs text-gray-500">
          {isLoading && "Loading..."}
          {saveState === "saving" && "Saving..."}
          {saveState === "saved" && "Saved"}
          {saveState === "error" && "Save failed"}
          {saveState === "idle" && !isLoading && " "}
        </p>
      </div>
    </WidgetCard>
  );
}