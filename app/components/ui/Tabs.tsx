"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export const TabsRoot = TabsPrimitive.Root;

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(function TabsList({ className = "", ...props }, ref) {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={`cg21-tabs-list ${className}`.trim()}
      {...props}
    />
  );
});
TabsList.displayName = "TabsList";

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(function TabsTrigger({ className = "", ...props }, ref) {
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={`cg21-tabs-trigger ${className}`.trim()}
      {...props}
    />
  );
});
TabsTrigger.displayName = "TabsTrigger";

export const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(function TabsContent({ className = "", ...props }, ref) {
  return (
    <TabsPrimitive.Content
      ref={ref}
      className={`cg21-tabs-content ${className}`.trim()}
      {...props}
    />
  );
});
TabsContent.displayName = "TabsContent";
