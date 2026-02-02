export default function Details() {
  return (
    <main class="govuk-main-wrapper">
        <h1 id="header" class="govuk-heading-l">
          Details about me!
        </h1>
        <p class="govuk-body">
          So you want more information on me? What are you? A fed? Smh I'll
          trust you this time.
        </p>
        <p class="govuk-body">
          You probably already know me by my alias Gizzy which I use all over
          the internet and that's the only name you get to use for me. If you
          couldn't tell from me literally using the{" "}
          <a class="govuk-link" href="https://design-system.service.gov.uk/">
            GOV•UK Design System
          </a>
          , I'm a nerd. I spent most of my time producing code for mostly dumb
          stuff but some of the stuff I make seems cool to me. These projects
          for instance I find cool are:
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>
            <a class="govuk-link" href="https://github.com/GizzyUwU/openlink">
              Openlink{" "}
            </a>{" "}
            - The custom built EdulinkOne Desktop/Web Client
          </li>
          <li>
            <a class="govuk-link" href="https://github.com/GizzyUwU/elt2ical">
              ELT2ICal{" "}
            </a>{" "}
            - It's a server that makes use of the EdulinkOne API to convert the
            lesson timetable to a ICalendar file so I could use google calendar
            to alert me of what room I am in for my next lesson. EdulinkOne does
            kind of already have this feature but I built this because it
            stopped working after a while which was annoying so I came up with
            my own solution.
          </li>
          <li>
            <a class="govuk-link" href="https://github.com/GizzyUwU/logpheus">
              Logpheus{" "}
            </a>{" "}
            - A Slack Bot built for the Hack Club event Flavortown (Flavourtown
            if you want to be correct in the spelling) with the original
            intention to post people's devlogs in their personal channels but
            now it's becoming more of a generic bot for the event.
          </li>
          <li>
            <a class="govuk-link" href="https://github.com/GizzyUwU/uuidle">
              UUIDLE{" "}
            </a>{" "}
            - I'd say this is one of my dumbest projects but also a pretty fun
            one, I took the idea of{" "}
            <a
              class="govuk-link"
              href="https://www.nytimes.com/games/wordle/index.html"
            >
              Wordle
            </a>{" "}
            by the New York Times and just replaced words with{" "}
            <a
              class="govuk-link"
              href="https://en.wikipedia.org/wiki/Universally_unique_identifier"
            >
              UUID's
            </a>{" "}
            and it taught me a bit, you would think it would be hard to guess
            and you would be wrong. Kind of, I had the idea of allowing bots to
            be able to guess it which lead to it being guessed under a second
            because of UUID's being semi repetitive and allowing multiple of the
            same characters to be spammed in one guess making it pretty easy to
            brute force.
          </li>
        </ul>
        <p class="govuk-body">
          Those project's was pretty fun to make and taught me a lot such as
          reverse engineering an undocumented API using an MITM. I'm also a
          proud{" "}
          <a class="govuk-link" href="https://hackclub.com">
            HackClubber
          </a>{" "}
          participating in their events such as Journey, Summer of Making,
          Flavortown and probably more in the future. Now for some information
          you may not know about me, I have a disability called{" "}
          <a
            class="govuk-link"
            href="https://en.wikipedia.org/wiki/Developmental_coordination_disorder"
            title="Dyspraxia, also known as developmental co-ordination disorder (DCD), is a common disorder that affects movement and co-ordination."
          >
            Dyspraxia
          </a>
          . I'm also an{" "}
          <a class="govuk-link" href="https://en.wikipedia.org/wiki/Non-binary">
            enby
          </a>{" "}
          that uses they/them pronouns so please be respectfully of that.
        </p>
    </main>
  );
}
