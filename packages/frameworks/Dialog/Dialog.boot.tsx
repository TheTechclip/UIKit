"use client";

import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import { type DialogInstance, DialogStore } from "./Dialog.store";

interface DialogBootstrapProps {
  "data-color-mode"?: string;
}

export default function DialogBootstrap(props: DialogBootstrapProps) {
  const [stack, setStack] = useState<DialogInstance[]>([]);

  useEffect(() => {
    return DialogStore.subscribe((nextStack) => {
      setStack(nextStack);
    });
  }, []);

  return stack.map((item) => (
    <Dialog
      key={item.instanceId}
      data-color-mode={
        props["data-color-mode"] ?? item.props["data-color-mode"]
      }
      {...item.props}
    />
  ));
}
