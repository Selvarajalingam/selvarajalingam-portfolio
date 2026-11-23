import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import GlideSelect from "@/components/ui/glide-select";

const options = [{ value: "dark", label: "Dark", tag: "Default" }, { value: "light", label: "Light" }, { value: "system", label: "System" }];

describe("Glide Select interaction contract", () => {
  it("supports keyboard selection, selected state, tags and native form serialization", () => {
    const onChange = vi.fn();
    const { container } = render(<form><GlideSelect options={options} defaultValue="dark" name="theme" ariaLabel="Theme" onChange={onChange} /></form>);
    const trigger = screen.getByRole("combobox", { name: "Theme" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    expect(screen.getByRole("option", { name: /Dark/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Default")).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: "End" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("data-value", "system");
    expect(new FormData(container.querySelector("form")!).get("theme")).toBe("system");
    expect(onChange).toHaveBeenCalledWith("system", options[2]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("supports typeahead and Escape without committing the highlighted value", () => {
    render(<GlideSelect options={options} defaultValue="dark" ariaLabel="Theme" />);
    const trigger = screen.getByRole("combobox");
    fireEvent.keyDown(trigger, { key: "l" });
    expect(trigger).toHaveAttribute("aria-activedescendant", screen.getByRole("option", { name: "Light" }).id);
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("data-value", "dark");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
  it("reflects external controlled values and closes when disabled", () => {
    const change = vi.fn();
    const { rerender } = render(<GlideSelect options={options} value="dark" onChange={change} />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("option", { name: "Light" }));
    expect(change).toHaveBeenCalledWith("light", options[1]);
    expect(trigger).toHaveAttribute("data-value", "dark");
    rerender(<GlideSelect options={options} value="light" onChange={change} />);
    fireEvent.click(trigger);
    rerender(<GlideSelect options={options} value="light" onChange={change} disabled />);
    expect(trigger).toBeDisabled();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    rerender(<GlideSelect options={options} value="light" onChange={change} />);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });
});
