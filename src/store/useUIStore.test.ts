import { beforeEach, describe, expect, it } from "vitest";
import useUIState from "./useUIStore";

describe("useUIStore.addNotification", () => {
  beforeEach(() => useUIState.setState({ notifications: [] }));

  it("appends notifications with increasing ids", () => {
    const { addNotification } = useUIState.getState();
    addNotification("first");
    addNotification("second");

    const { notifications } = useUIState.getState();
    expect(notifications.map((n) => n.message)).toEqual(["first", "second"]);
    expect(notifications.map((n) => n.id)).toEqual([1, 2]);
    expect(notifications.every((n) => n.timestamp instanceof Date)).toBe(true);
  });

  it("does not leave holes in the array", () => {
    useUIState.getState().addNotification("only");
    const { notifications } = useUIState.getState();
    expect(notifications).toHaveLength(1);
    expect(notifications.every(Boolean)).toBe(true);
  });
});
