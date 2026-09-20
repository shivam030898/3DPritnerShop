"use client";

import { useState } from "react";
import Switch from "@/components/ui/Switch";

export default function NotificationSettings() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [shippingUpdates, setShippingUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);

  return (
    <div className="divide-y divide-border">
      <Switch checked={orderUpdates} onChange={setOrderUpdates} label="Order updates" />
      <Switch checked={shippingUpdates} onChange={setShippingUpdates} label="Shipping updates" />
      <Switch checked={promotions} onChange={setPromotions} label="Promotions" />
    </div>
  );
}
