import * as RemixServer from "@remix-run/node";
import * as RemixReact from "@remix-run/react";

import * as Session from "~/session.server";

export async function loader({ request }: RemixServer.LoaderArgs) {
  let session = await Session.getSession(request.headers.get("Cookie"));
  let step = session.get("step") as number | undefined;
  step = step || 0;

  return RemixServer.json({ step });
}

export async function action({ request }: RemixServer.ActionArgs) {
  let formData = await request.formData();
  let stepValue = formData.get("step");
  let step = Number.parseInt(
    typeof stepValue === "string" && stepValue ? stepValue : "0",
    10
  );

  let session = await Session.getSession(request.headers.get("Cookie"));
  session.set("step", step);

  return RemixServer.json(
    {
      step,
    },
    {
      headers: {
        "Set-Cookie": await Session.commitSession(session),
      },
    }
  );
}

export default function Form() {
  let loaderData = RemixReact.useLoaderData<typeof loader>();
  let actionData = RemixReact.useActionData<typeof action>();
  let submit = RemixReact.useSubmit();

  let step = typeof actionData === "object" ? actionData.step : loaderData.step;

  return (
    <main>
      <RemixReact.Form
        method="post"
        onChange={(event) => {
          submit(event.currentTarget);
        }}
      >
        <label>
          Step:
          <input
            defaultValue={step}
            name="step"
            type="number"
            min={0}
            max={9}
          />
        </label>
        <button>Save</button>
      </RemixReact.Form>
    </main>
  );
}
