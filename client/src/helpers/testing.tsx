import { render, RenderResult } from "@testing-library/react";
import { MemoryRouter, MemoryRouterProps } from "react-router-dom";
import { FC, PropsWithChildren, ReactElement } from "react";

export const renderWithRouter = (
  component: ReactElement,
  options: MemoryRouterProps = {}
): RenderResult => {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <MemoryRouter {...options}>{children}</MemoryRouter>
  );

  return render(component, { wrapper: Wrapper });
};
