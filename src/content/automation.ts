// The "Automation Example" section on the Baba Casino page: two Python + Playwright payment-flow tests that
// "run" in step with a screen recording of the flow (see AutomationPlayer). Content is data, so this file holds
// the code shown, the recording and the timing.
//
// NAMING RULE (from the owner, firm): every identifier, selector, endpoint and JSON key in the code below is
// invented and unrelated to the real test suite. Never derive a name from the real code. The structure and the
// logic are the real ones; the owner's own comments and the visible texts "Credit Card" and "PROCEED" are kept.

export type CueKind = "step" | "assert" | "api";

/** One moment of the run, on the recording's clock: at `t` seconds the run reaches the first line at or after
 *  the previous cue's line that contains `at`. */
export type CueSpec = {
  t: number;
  at: string;
  kind: CueKind;
  /** Shown on the thin step line under the editor while this cue is current. */
  label: string;
  /** api cues: shown at the end of the line once the response has arrived (the wait is shown until then). */
  chip?: string;
};

export type VideoSpec = {
  src: string;
  poster: string;
  /** Real size of the recording: the preview box gets exactly this ratio, so there are no black edges. */
  width: number;
  height: number;
  duration: number;
};

export type AutomationExample = {
  id: "desktop" | "mobile";
  title: string;
  viewport: string;
  fn: string;
  file: string;
  code: string;
  video: VideoSpec;
  cues: CueSpec[];
};

const desktopCode = String.raw`import json
import re

from playwright.sync_api import Page, expect

from screens import HomeScreen


def test_checkout_flow_desktop(page: Page) -> None:
    home = HomeScreen(page)

    # Open Store
    with page.expect_response(lambda res: "/svc/v2/catalog" in res.url and res.status == 200):
        home.bag_button.click(timeout=10000)

    pick = page.locator(".tile-cta").nth(2)
    expect(pick).to_be_visible(timeout=10000)

    captured = []
    page.on("request", lambda r: captured.append(r))
    pick.click()

    # API 1
    with page.expect_response("**/ord/prepare") as waiter_a, \
         page.expect_response("**/ord/commit") as waiter_b:
        res_a = waiter_a.value
        res_b = waiter_b.value
    assert res_a.json()["ref_code"] == res_b.json()["ref_code"]

    expect(page.locator(".checkout-sheet")).to_be_visible()
    page.get_by_text("Credit Card", exact=True).click()
    expect(page.locator("span.total-line")).to_be_visible()
    page.get_by_role("button", name="Continue").click()
    page.frame_locator("iframe[src*='secure-form']").locator("input#sec-code").fill("123")
    page.get_by_role("button", name="PROCEED").click()

    # API 2
    with page.expect_response("**/ord/finalize") as waiter_c:
        res_c = waiter_c.value
    assert res_b.json()["ticket"] == \
           res_c.json()["envelope"]["result"]["slot"]["ticket"]

    page.locator(".spinner-veil").wait_for(state="hidden", timeout=20000)
    expect(page.locator(".receipt-backdrop")).to_be_visible(timeout=20000)

    # Capture balance
    tally_before = page.locator(".tally-left span").first.text_content()

    while page.locator(".cta-main.wide-only").is_visible():
        ack = page.locator('app-recap .cta-main:has-text("Got it")')
        ack.wait_for(state="visible")
        page.wait_for_function('el => window.getComputedStyle(el).opacity === "1"', arg=ack.element_handle())
        ack.click()
        expect(page.locator("app-recap")).not_to_be_visible()

    # Balance updated?
    expect(page.locator(".tally-fresh span").first).not_to_have_text(tally_before)

    # Request log checks
    assert len(set(json.loads(r.post_data).get("ctx", {}).get("sid") for r in captured if
                   "telemetry" in r.url and r.post_data and "sid" in r.post_data)) == 1
    assert {json.loads(r.post_data_json["batch"][0]["body"].get("extra", "{}")).get("trace_id")
            for r in captured if "telemetry" in r.url and r.post_data} - {None} == {res_a.request.post_data_json["trace_id"]}`;

const mobileCode = String.raw`import json
import re

from playwright.sync_api import Page, expect

from screens import HomeScreen


def test_checkout_flow_mobile(page: Page) -> None:
    home = HomeScreen(page)

    # Open Store
    with page.expect_response(lambda res: "/svc/v2/catalog" in res.url and res.status == 200):
        home.bag_button_compact.click(timeout=10000)

    pick = page.locator(".tile-cta-sm").nth(2)
    expect(pick).to_be_visible(timeout=10000)

    captured = []
    page.on("request", lambda r: captured.append(r))
    pick.click()

    # API 1
    with page.expect_response("**/ord/prepare") as waiter_a, \
         page.expect_response("**/ord/commit") as waiter_b:
        res_a = waiter_a.value
        res_b = waiter_b.value
    assert res_a.json()["ref_code"] == res_b.json()["ref_code"]

    expect(page.locator(".checkout-sheet.sheet-compact")).to_be_visible()
    page.get_by_text("Credit Card", exact=True).click()
    expect(page.locator("span.total-line")).to_be_visible()
    page.get_by_role("button", name="Continue").click()
    page.frame_locator("iframe[src*='secure-form']").locator("input#sec-code").fill("123")
    page.get_by_role("button", name="PROCEED").click()

    # API 2
    with page.expect_response("**/ord/finalize") as waiter_c:
        res_c = waiter_c.value
    assert res_b.json()["ticket"] == \
           res_c.json()["envelope"]["result"]["slot"]["ticket"]

    page.locator(".spinner-veil").wait_for(state="hidden", timeout=20000)
    expect(page.locator(".receipt-backdrop img")).to_be_visible(timeout=20000)

    # Capture balance
    tally_before = page.locator("span.tally-chip.strong").first.text_content()

    ack = page.locator('app-recap .cta-main-sm:has-text("Got it")')
    while ack.is_visible():
        expect(page.locator("app-recap")).to_be_visible()
        ack.wait_for(state="visible")
        page.wait_for_function('el => window.getComputedStyle(el).opacity === "1"', arg=ack.element_handle())
        ack.click()
        expect(page.locator("app-recap")).not_to_be_visible()

    # Balance updated?
    expect(page.locator("span.tally-fresh.strong").first).not_to_have_text(tally_before)

    # Request log checks
    assert len(set(json.loads(r.post_data).get("ctx", {}).get("sid") for r in captured if
                   "telemetry" in r.url and r.post_data and "sid" in r.post_data)) == 1
    assert {json.loads(r.post_data_json["batch"][0]["body"].get("extra", "{}")).get("trace_id")
            for r in captured if "telemetry" in r.url and r.post_data} - {None} == {res_a.request.post_data_json["trace_id"]}`;

// Times (seconds) were read frame by frame from the two recordings (17.5 s and 17.4 s, no login: they start at the store); nudge a value here if a
// highlighted line ever feels early or late against the picture.
const desktopCues: CueSpec[] = [
  { t: 0.0, at: "home = HomeScreen", kind: "step", label: "Starting the test" },
  { t: 0.1, at: "with page.expect_response(lambda", kind: "api", label: "Opening the store", chip: "200 · /svc/v2/catalog" },
  { t: 0.25, at: "home.bag_button.click", kind: "step", label: "Opening the store" },
  { t: 0.8, at: "pick = page.locator", kind: "step", label: "Choosing a package" },
  { t: 0.9, at: "expect(pick)", kind: "assert", label: "Checking the package button" },
  { t: 2.6, at: "captured = []", kind: "step", label: "Logging requests" },
  { t: 2.7, at: "page.on(", kind: "step", label: "Logging requests" },
  { t: 2.85, at: "pick.click()", kind: "step", label: "Choosing a package" },
  { t: 3.0, at: "expect_response(\"**/ord/prepare\")", kind: "api", label: "API 1 · waiting for responses", chip: "200 · 2 responses" },
  { t: 5.0, at: "res_a = waiter_a.value", kind: "step", label: "API 1 · reading the responses" },
  { t: 5.1, at: "assert res_a.json()[\"ref_code\"]", kind: "assert", label: "API 1 · comparing ref_code" },
  { t: 5.2, at: "\".checkout-sheet\"", kind: "assert", label: "Checking the checkout sheet" },
  { t: 5.4, at: "get_by_text(\"Credit Card\"", kind: "step", label: "Paying by credit card" },
  { t: 5.5, at: "span.total-line", kind: "assert", label: "Checking the total" },
  { t: 6.85, at: "name=\"Continue\"", kind: "step", label: "Continue" },
  { t: 7.05, at: "frame_locator", kind: "step", label: "Entering the security code" },
  { t: 7.35, at: "name=\"PROCEED\"", kind: "step", label: "Confirming the payment" },
  { t: 7.45, at: "expect_response(\"**/ord/finalize\")", kind: "api", label: "API 2 · waiting for /ord/finalize", chip: "200 · /ord/finalize" },
  { t: 9.9, at: "res_c = waiter_c.value", kind: "step", label: "API 2 · reading the response" },
  { t: 10.0, at: "assert res_b.json()[\"ticket\"]", kind: "assert", label: "API 2 · comparing ticket" },
  { t: 10.1, at: "\".spinner-veil\"", kind: "step", label: "Waiting for the loader" },
  { t: 11.0, at: "\".receipt-backdrop\"", kind: "assert", label: "Checking the receipt" },
  { t: 12.0, at: "tally_before =", kind: "step", label: "Capturing the balance" },
  { t: 12.2, at: "while page.locator", kind: "step", label: "Summary loop" },
  { t: 12.4, at: "ack = page.locator", kind: "step", label: "Summary loop" },
  { t: 12.8, at: "ack.wait_for", kind: "step", label: "Waiting for the button" },
  { t: 12.9, at: "page.wait_for_function", kind: "step", label: "Waiting for the button to fade in" },
  { t: 14.6, at: "ack.click()", kind: "step", label: "Closing the summary" },
  { t: 14.8, at: "not_to_be_visible()", kind: "assert", label: "Waiting for the summary to close" },
  { t: 15.6, at: "tally-fresh", kind: "assert", label: "Checking the updated balance" },
  { t: 16.3, at: "assert len(set(", kind: "assert", label: "Request log · one session" },
  { t: 16.9, at: "assert {json.loads", kind: "assert", label: "Request log · trace id" },
];

const mobileCues: CueSpec[] = [
  { t: 0.0, at: "home = HomeScreen", kind: "step", label: "Starting the test" },
  { t: 0.1, at: "with page.expect_response(lambda", kind: "api", label: "Opening the store", chip: "200 · /svc/v2/catalog" },
  { t: 1.9, at: "home.bag_button_compact.click", kind: "step", label: "Opening the store" },
  { t: 4.55, at: "pick = page.locator", kind: "step", label: "Choosing a package" },
  { t: 4.6, at: "expect(pick)", kind: "assert", label: "Checking the package button" },
  { t: 4.65, at: "captured = []", kind: "step", label: "Logging requests" },
  { t: 4.7, at: "page.on(", kind: "step", label: "Logging requests" },
  { t: 4.75, at: "pick.click()", kind: "step", label: "Choosing a package" },
  { t: 4.85, at: "expect_response(\"**/ord/prepare\")", kind: "api", label: "API 1 · waiting for responses", chip: "200 · 2 responses" },
  { t: 6.3, at: "res_a = waiter_a.value", kind: "step", label: "API 1 · reading the responses" },
  { t: 6.4, at: "assert res_a.json()[\"ref_code\"]", kind: "assert", label: "API 1 · comparing ref_code" },
  { t: 6.5, at: "\".checkout-sheet.sheet-compact\"", kind: "assert", label: "Checking the checkout sheet" },
  { t: 6.6, at: "get_by_text(\"Credit Card\"", kind: "step", label: "Paying by credit card" },
  { t: 6.7, at: "span.total-line", kind: "assert", label: "Checking the total" },
  { t: 7.85, at: "name=\"Continue\"", kind: "step", label: "Continue" },
  { t: 8.05, at: "frame_locator", kind: "step", label: "Entering the security code" },
  { t: 8.4, at: "name=\"PROCEED\"", kind: "step", label: "Confirming the payment" },
  { t: 8.5, at: "expect_response(\"**/ord/finalize\")", kind: "api", label: "API 2 · waiting for /ord/finalize", chip: "200 · /ord/finalize" },
  { t: 10.4, at: "res_c = waiter_c.value", kind: "step", label: "API 2 · reading the response" },
  { t: 10.5, at: "assert res_b.json()[\"ticket\"]", kind: "assert", label: "API 2 · comparing ticket" },
  { t: 10.6, at: "\".spinner-veil\"", kind: "step", label: "Waiting for the loader" },
  { t: 10.9, at: "\".receipt-backdrop img\"", kind: "assert", label: "Checking the receipt" },
  { t: 12.0, at: "tally_before =", kind: "step", label: "Capturing the balance" },
  { t: 12.4, at: "ack = page.locator", kind: "step", label: "Summary loop" },
  { t: 12.5, at: "while ack.is_visible()", kind: "step", label: "Summary loop" },
  { t: 12.6, at: "to_be_visible()", kind: "assert", label: "Checking the summary" },
  { t: 12.8, at: "ack.wait_for", kind: "step", label: "Waiting for the button" },
  { t: 12.9, at: "page.wait_for_function", kind: "step", label: "Waiting for the button to fade in" },
  { t: 14.3, at: "ack.click()", kind: "step", label: "Closing the summary" },
  { t: 14.4, at: "not_to_be_visible()", kind: "assert", label: "Waiting for the summary to close" },
  { t: 15.2, at: "tally-fresh", kind: "assert", label: "Checking the updated balance" },
  { t: 16.2, at: "assert len(set(", kind: "assert", label: "Request log · one session" },
  { t: 16.8, at: "assert {json.loads", kind: "assert", label: "Request log · trace id" },
];

export const paymentFlowExamples: AutomationExample[] = [
  {
    id: "desktop",
    title: "Desktop",
    viewport: "1920×1080",
    fn: "test_checkout_flow_desktop",
    file: "test_checkout.py",
    code: desktopCode,
    video: {
      src: "/videos/baba/payment-desktop.mp4",
      poster: "/videos/baba/payment-desktop-poster.jpg",
      width: 1280,
      height: 696,
      duration: 17.49,
    },
    cues: desktopCues,
  },
  {
    id: "mobile",
    title: "Mobile",
    viewport: "375×812",
    fn: "test_checkout_flow_mobile",
    file: "test_checkout.py",
    code: mobileCode,
    video: {
      src: "/videos/baba/payment-mobile.mp4",
      poster: "/videos/baba/payment-mobile-poster.jpg",
      width: 540,
      height: 1170,
      duration: 17.4,
    },
    cues: mobileCues,
  },
];
