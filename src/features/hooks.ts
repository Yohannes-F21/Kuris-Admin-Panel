import { useDispatch } from "react-redux";
import { AppDispatch } from "./store"; // Adjust the import path as needed

export const useAppDispatch = () => useDispatch<AppDispatch>();
