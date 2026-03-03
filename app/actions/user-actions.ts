"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUserData() {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/auth/login");
    }

    const { data, error } = await supabase
        .from("user_options")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function saveUserLocation(location: string) {
    const supabase = await createClient();

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
        redirect("/auth/login");
    }

    const { error } = await supabase
        .from("user_options")
        .upsert(
            { user_id: user.id, user_location: location },
            { onConflict: "user_id" }
        );

    if (error) {
        throw new Error(error.message);
    }
}

export async function addWidget(
  widgetName: string,
  widgetOptions: Record<string, unknown>,
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const newWidget = {
    widget: widgetName,
    widget_id: crypto.randomUUID(),
    widget_options: widgetOptions,
  };

  // Step 1: add new widget to relevant widget table
  const { error: addWidgetError } = await supabase
    .from(widgetName)
    .insert({
      user_id: user.id,
      widget_id: newWidget.widget_id,
      widget_options: newWidget.widget_options,
    });

  if (addWidgetError) {
    throw new Error(addWidgetError.message);
  }

  // Step 2: update user_options "added_widgets" array with new widget (attempt to undo step 1 if step 2 fails)
  const { data: currentData, error: currentError } = await supabase
    .from("user_options")
    .select("added_widgets")
    .eq("user_id", user.id)
    .maybeSingle();

  if (currentError) {
    await supabase
      .from(widgetName)
      .delete()
      .eq("user_id", user.id)
      .eq("widget_id", newWidget.widget_id);
    throw new Error(currentError.message);
  }

  const existingWidgets = Array.isArray(currentData?.added_widgets)
    ? currentData.added_widgets
    : [];

  const { error: updateOptionsError } = await supabase
    .from("user_options")
    .upsert(
      { user_id: user.id, added_widgets: [...existingWidgets, newWidget] },
      { onConflict: "user_id" },
    );

  if (updateOptionsError) {
    await supabase
      .from(widgetName)
      .delete()
      .eq("user_id", user.id)
      .eq("widget_id", newWidget.widget_id);
    throw new Error(updateOptionsError.message);
  }
}

export async function updateWidget(widgetName: string, widgetId: string, widgetOptions: Record<string, unknown>) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { error } = await supabase
    .from(widgetName)
    .update({ widget_options: widgetOptions })
    .eq("user_id", user.id)
    .eq("widget_id", widgetId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function loadWidget(widgetName: string, widgetId: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from(widgetName)
    .select("widget_options")
    .eq("user_id", user.id)
    .eq("widget_id", widgetId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return JSON.parse(data?.widget_options) ?? null;
}