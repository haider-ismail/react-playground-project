import React from "react";
import { useUIStore } from "../hooks/useUIStore";

export const UIStoreContext = React.createContext({} as ReturnType<typeof useUIStore>)