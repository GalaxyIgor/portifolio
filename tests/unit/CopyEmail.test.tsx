import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CopyEmail } from "@/components/sections/CopyEmail";

const labels = {
  copy: "Copiar e-mail",
  copied: "E-mail copiado",
  failed: "Não foi possível copiar",
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("CopyEmail", () => {
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
  });

  it("avisa quando a cópia falha", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("negado"),
    );
    render(<CopyEmail email="eu@exemplo.com" labels={labels} />);

    await user.click(screen.getByRole("button", { name: labels.copy }));

    expect(await screen.findByText(labels.failed)).toBeInTheDocument();
  });
});
