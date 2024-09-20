import type { ReactNode, JSX } from "react";
export type funcWithChildren<T> = (props: propsWithChildren<T>) => JSX.Element;

export type propsWithChildren<T> = T & childrenProps;
export type childrenProps = { children: ReactNode };
