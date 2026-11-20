import type { ChecklistData } from "../../components/checklist-layer/types";

// "broken" finishes the rail line "Visitors would see: ..." when an item is unticked.
export const checklistBlog: ChecklistData = {
  title: "Blog checklist",
  note: "11 items of its own. Untick one to see the blog without it. The header and footer are the shared ones. Grey numbers cannot be pointed at.",
  groups: [
    {
      title: "Article page",
      items: [
        { n: 1, shown: true, text: "A clear title and summary at the top", where: "The title and the sentence under it", broken: "a title like \"Notes, part 3\" and no sentence saying what the post is about" },
        { n: 2, shown: true, text: "Author, publish date and update date shown", where: "The line under the summary", broken: "\"By the team\" and no dates, so nobody can tell how old it is" },
        { n: 3, shown: false, text: "Article structured data", where: "A block in the page that tells search engines the headline, author, dates and image; it cannot be seen", broken: "search engines guessing at who wrote it and when" },
        { n: 4, shown: true, text: "Headings, short paragraphs and a table of contents for long posts", where: "The On this page list, then three headed sections", broken: "one long block of text with no headings and no way to jump" },
        { n: 5, shown: true, text: "Images with alt text and sizes set", where: "The picture and its caption", broken: "a picture read out as its file name, that pushes the text down when it loads" },
      ],
    },
    {
      title: "Listing",
      items: [
        { n: 6, shown: true, text: "Posts by topic or tag, with page-by-page lists", where: "The topic switch and the Previous and Next buttons under More posts", broken: "every post in one long list, with no way to pick a topic" },
        { n: 7, shown: true, text: "Related posts at the end", where: "Related posts, at the end of the article", broken: "the article just stops, and readers leave" },
      ],
    },
    {
      title: "Sharing",
      items: [
        { n: 8, shown: true, text: "Link preview tags on every post", where: "The card under Share and follow: image, title and summary", broken: "a bare address in the chat, with no picture or title" },
        { n: 9, shown: true, text: "An RSS or Atom feed", where: "The Subscribe link under Share and follow", broken: "no way to follow the blog except coming back and looking" },
      ],
    },
    {
      title: "Upkeep",
      items: [
        { n: 10, shown: true, text: "Old posts reviewed; out-of-date ones updated or redirected", where: "The note on the old post under From the archive", broken: "a 2022 post with a removed command, and nothing saying so" },
        { n: 11, shown: true, text: "Comments, if any, moderated and marked ugc", where: "The moderation note and the reader's link under Comments", broken: "a spam comment shown at once, its link passing on the blog's good name" },
      ],
    },
  ],
};
