import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistHelpDesk: ChecklistData = {
  title: "Help desk checklist",
  note: "10 items of its own. Untick one to see the page without it. The page is one made-up help centre for a product called Lorem. The header, footer, button, link, form and fields are the shared ones.",
  groups: [
    {
      title: "Intake",
      items: [
        { n: 1, shown: true, text: "Contact options easy to find from every screen", where: "The contact strip under the header: chat, email and phone, each with its reply time", broken: "no contact option on the page; it is three clicks away in a footer menu" },
        { n: 2, shown: true, text: "A form that asks the right details up front", where: "The request form: email, order number, topic and what happened", broken: "one empty message box, so support must ask for the details in a second email" },
        { n: 3, shown: true, text: "Every request gets a reference and a reply time", where: "The confirmation after sending: a reference number and when to expect a reply", broken: "\"Thanks, message sent\" with no number and no time" },
      ],
    },
    {
      title: "Handling",
      items: [
        { n: 4, shown: true, text: "Response and fix time targets by priority", where: "The targets table: four priorities, each with a first reply and a fix time", broken: "\"We reply as soon as we can\"" },
        { n: 5, shown: true, text: "Requests sorted and routed to the right team", where: "The ticket's routing card: topic, team and priority set on arrival", broken: "every request in one shared queue, passed between teams by hand" },
        { n: 6, shown: true, text: "Customers told who is helping and what happens next", where: "The ticket's progress card: the named person, what they are doing and when you will hear next", broken: "a status that only says \"Open\"" },
      ],
    },
    {
      title: "Records",
      items: [
        { n: 7, shown: true, text: "History kept so nobody has to repeat themselves", where: "The ticket's history card: earlier chats and emails on the same topic", broken: "every new person asks the same questions again" },
        { n: 8, shown: true, text: "Personal data limited and deleted on schedule", where: "The privacy note: only what is needed, kept 12 months, then deleted", broken: "no word on what is kept or for how long" },
      ],
    },
    {
      title: "Learning",
      items: [
        { n: 9, shown: true, text: "Common questions turned into help articles", where: "The top articles: each one written from questions asked most often", broken: "no articles, so the same answer is typed out again and again" },
        { n: 10, shown: true, text: "Complaints counted and reviewed for root causes", where: "The complaints card: the count this quarter, the main cause and the fix", broken: "complaints answered one by one, with nobody counting them" },
      ],
    },
  ],
};
