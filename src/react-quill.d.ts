declare module "react-quill" {
  import { ComponentType } from "react";

  const ReactQuill: ComponentType<{
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    modules?: Record<string, any>;
    formats?: string[];
    theme?: string;
    readOnly?: boolean;
  }>;

  export default ReactQuill;
}
