import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Container } from "../components/Container/Container";

describe("Container", () => {
  it("correctly renders children", () => {
    render(
      <Container>
        <div data-testid="test-child">Content</div>
      </Container>
    );

    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });
});
