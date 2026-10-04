import { afterEach, describe, expect, it, vi } from "vitest";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyEmail } from "@/components/sections/CopyEmail";

const labels = {
  copy: "Copiar e-mail",
  copied: "E-mail copiado",
  failed: "Não foi possível copiar",
};

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("CopyEmail", () => {
  it("remove a confirmação depois de 2,5 segundos", async () => {
    vi.useFakeTimers();
    userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
    render(<CopyEmail email="eu@exemplo.com" labels={labels} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: labels.copy }));
    });
    expect(
      screen.getByRole("button", { name: labels.copied }).querySelector("svg"),
    ).toBeInTheDocument();
    await act(async () => {
      vi.advanceTimersByTime(2500);
    });
    expect(
      screen.getByRole("button", { name: labels.copy }).querySelector("svg"),
    ).toBeNull();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
  it("copia o e-mail e confirma no botão", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    render(<CopyEmail email="eu@exemplo.com" labels={labels} />);

    await user.click(screen.getByRole("button", { name: labels.copy }));

    expect(writeText).toHaveBeenCalledWith("eu@exemplo.com");
    expect(
      screen.getByRole("button", { name: labels.copied }),
    ).toBeInTheDocument();
    expect(
      screen
        .getByRole("button", { name: labels.copied })
        .querySelector('svg[aria-hidden="true"]'),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(labels.copied);
  });

  it("avisa quando a cópia falha", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("negado"),
    );
    render(<CopyEmail email="eu@exemplo.com" labels={labels} />);

    await user.click(screen.getByRole("button", { name: labels.copy }));

    expect(await screen.findByText(labels.failed)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: labels.copy }).querySelector("svg"),
    ).toBeNull();
  });
});
