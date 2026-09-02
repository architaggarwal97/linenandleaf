export type Block =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "note"; text: string };

export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  tag: string;
  date: string;
  readingTime: string;
  blocks: Block[];
}

export const posts: BlogPost[] = [
  {
    slug: "how-much-water-does-dry-cleaning-use",
    title: "How Much Water Does Dry Cleaning Really Use? (And How We Cut It By 99%)",
    metaTitle: "How Much Water Does Dry Cleaning Really Use? | Linen & Leaf",
    metaDescription:
      "Curious how dry cleaning stacks up against a home wash for water use? Here's the real comparison behind the 99% figure — and why it matters for South Delhi.",
    excerpt:
      "A home wash cycle can use 40 to 150+ litres. Here's the real comparison behind the 99% figure — and why it matters in a city like Delhi.",
    tag: "Eco Cleaning",
    date: "September 2026",
    readingTime: "4 min read",
    blocks: [
      {
        type: "p",
        text: "Every time a washing machine runs a cycle, it's pulling far more water than most people stop to think about. Multiply that by every household on a street, every week of the year, and laundry quietly becomes one of the more water-intensive habits in daily life — which matters more in a city like Delhi, where water supply is never something to take for granted.",
      },
      {
        type: "p",
        text: "So here's a question worth asking: what if the way you clean your clothes barely touched water at all?",
      },
      { type: "h2", text: "How much water does a normal wash cycle actually use?" },
      {
        type: "p",
        text: "It depends on the machine, but the range is wider than most people expect. An efficient front-loading washing machine uses somewhere around 40 litres per cycle. Older top-loaders — still common in a lot of Indian households — can use 150 litres or more for a single load. Run that a few times a week, for a family, for a year, and the number gets large fast.",
      },
      {
        type: "p",
        text: "None of that water is optional. It's the water doing the actual work: soaking the fabric, agitating it to loosen dirt, rinsing the detergent back out, sometimes rinsing twice. It's simply how washing machines are built to clean.",
      },
      { type: "h2", text: "So how does dry cleaning avoid all of that?" },
      {
        type: "p",
        text: "The name gives it away, but it's worth actually explaining: dry cleaning doesn't use water as the cleaning agent at all. Instead, a cleaning solvent does the job that water and detergent do in a home wash — lifting oils, dirt, and stains out of the fabric — without the soak-agitate-rinse cycle a washing machine depends on.",
      },
      {
        type: "p",
        text: "That's not a new technology. It's literally what \"dry\" cleaning has always meant. What's changed is that most people have never actually connected that to a water-saving story — it's just always been \"the thing you do for suits and delicate clothes,\" not \"the thing that happens to use a fraction of the water your washing machine does.\"",
      },
      { type: "h2", text: "Where does the \"99% less water\" figure actually come from?" },
      {
        type: "p",
        text: "It's worth being precise about this rather than just throwing the number around, because precision is what makes it trustworthy.",
      },
      {
        type: "p",
        text: "The comparison is against a standard household wash cycle — the 40 to 150+ litres a washing machine uses per load. Since the dry-cleaning process itself doesn't rely on water as the cleaning medium, the water used across the whole process (some finishing and steam-pressing steps may use a small amount) comes in dramatically lower than that baseline. That's where the 99% comes from: not a marketing round number, but a real comparison against what a normal wash cycle actually uses.",
      },
      {
        type: "p",
        text: "We think that distinction matters. A claim is only as good as the comparison behind it, and \"99% less than what, exactly\" is a fair question to ask any business making an environmental promise.",
      },
      { type: "h2", text: "Why this matters more in South Delhi specifically" },
      {
        type: "p",
        text: "Delhi's relationship with water supply isn't news to anyone who lives here — shortages, tanker dependency, and seasonal stress are part of life in large parts of the city, Sarojini Nagar and the neighbourhoods around it included. Against that backdrop, a laundry choice that meaningfully cuts water use isn't just a nice environmental footnote. It's a small, genuinely useful decision that adds up across a household, a building, a neighbourhood.",
      },
      { type: "h2", text: "It's not only about water — what this means for your clothes" },
      {
        type: "p",
        text: "There's a second benefit that often gets less attention: garments that don't do well in a washing machine's soak-and-agitate cycle — silk, structured blazers, delicate embroidery, tailored suits — tend to hold their shape and colour better when they're not being mechanically churned in water. Less water isn't just an environmental win; for the right fabrics, it's also a gentler process.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "Dry cleaning was never really about water at all — it was always about a different cleaning method. But once you put a real number next to it, it turns out to be one of the more water-conscious things you can do with your laundry, almost by accident. In a city where water is worth thinking about, that's a detail worth knowing.",
      },
      {
        type: "note",
        text: "Linen & Leaf is an independent dry-cleaning service based at Sarojini Nagar Market, New Delhi, built around modern, low-water equipment and full transparency on how your garments are handled. [Book a pickup / visit us in person] to see the process for yourself.",
      },
    ],
  },
  {
    slug: "dry-cleaning-safe-for-baby-clothes",
    title: "Is Dry Cleaning Safe for Baby Clothes and Sensitive Skin?",
    metaTitle: "Is Dry Cleaning Safe for Baby Clothes and Sensitive Skin? | Linen & Leaf",
    metaDescription:
      "Parents and anyone with sensitive skin often wonder if professional garment care is gentler than a home wash. Here's what actually matters, and what to ask.",
    excerpt:
      "Detergent residue, fragrance and dye cause more irritation than dirt does. What professional care actually solves — and the questions worth asking.",
    tag: "Fabric Care",
    date: "September 2026",
    readingTime: "3 min read",
    blocks: [
      {
        type: "p",
        text: "Most parents have had this moment: a new baby, a pile of tiny clothes, and a sudden, very specific worry about what's actually touching that skin. It's a fair thing to worry about — a newborn's skin is thinner and more reactive than an adult's, and a lot of what causes irritation in laundry isn't dirt at all. It's what's left behind after washing.",
      },
      { type: "h2", text: "What actually irritates sensitive skin in laundry" },
      {
        type: "p",
        text: "The usual suspects aren't exotic. Detergent residue that doesn't fully rinse out, added fragrance, dye, and — for anyone with eczema or general skin sensitivity — the same triggers show up whether the wearer is six months old or sixty years old. This is exactly why pediatricians commonly recommend fragrance-free, dye-free detergent for infant clothing, and why a lot of adults with sensitive skin end up doing the same trial-and-error to find products that don't leave them itchy.",
      },
      {
        type: "p",
        text: "The problem usually isn't \"dirty vs. clean.\" It's what's chemically left on the fabric once the wash is done.",
      },
      { type: "h2", text: "Where professional garment care fits in" },
      {
        type: "p",
        text: "This is where the conversation usually turns to dry cleaning or professional laundering, and it's worth being precise rather than making a blanket claim. Professional garment care isn't automatically \"safer\" in some universal sense — but it does address a couple of the specific things that cause reactions in home laundry:",
      },
      {
        type: "ul",
        items: [
          "**Rinse-out consistency.** A home wash relies on the machine's rinse cycle to fully clear detergent; professional processes are built around getting this right consistently, load after load, which matters if residue is the actual irritant.",
          "**Finishing heat.** Steam pressing and other heat-based finishing steps expose fabric to meaningfully higher heat than most home dryers reach, which has some natural effect on dust mites and other common allergens — though this varies by process, and it isn't a substitute for genuinely gentle, fragrance-conscious handling in the first place.",
        ],
      },
      {
        type: "p",
        text: "Neither of those is a guarantee on its own. What actually matters is the specific products and process a given service uses — which is exactly what's worth asking about.",
      },
      { type: "h2", text: "What to actually ask a dry cleaner, if this matters to you" },
      {
        type: "p",
        text: "If sensitive skin or baby clothes are the reason you're looking into professional care, a few direct questions tell you more than any marketing claim will:",
      },
      {
        type: "ul",
        items: [
          "What detergents or solvents do you use, and are fragrance-free options available on request?",
          "Are delicate or baby items processed separately, or in the same batch as everything else?",
          "Can special handling instructions (no fragrance, extra rinse, gentle cycle only) actually be followed per order?",
        ],
      },
      {
        type: "p",
        text: "A service that can answer these plainly is a better sign than one that just says \"hypoallergenic\" without explaining why.",
      },
      { type: "h2", text: "Our approach at Linen & Leaf" },
      {
        type: "p",
        text: "We handle every order individually rather than in anonymous bulk batches, which means special instructions — fragrance-free, extra care for baby items, anything specific to a garment — are things you can actually request, not just hope for. We're happy to talk through exactly what that looks like for your particular items before you book, rather than asking you to take a generic claim on faith.",
      },
      {
        type: "note",
        text: "Have a specific concern about an item or fabric? [Message us on WhatsApp] and we'll talk it through before you book anything.",
      },
    ],
  },
  {
    slug: "photo-checkpoints-transparency",
    title: "Why Photo Checkpoints Are the New Standard in Dry Cleaning",
    metaTitle: "Why Photo Checkpoints Are the New Standard in Dry Cleaning | Linen & Leaf",
    metaDescription:
      "What actually happens to your clothes between drop-off and pickup? Here's why a simple photo at each stage solves one of dry cleaning's oldest trust problems.",
    excerpt:
      "Most garment disputes aren't about bad service — they're about the absence of a record. Two photos change that for both sides.",
    tag: "Transparency",
    date: "September 2026",
    readingTime: "3 min read",
    blocks: [
      {
        type: "p",
        text: "Hand your clothes to a dry cleaner and, for the next day or two, they exist in a kind of black box. You don't see what happens between drop-off and pickup. You just trust that it goes well — and most of the time, it does. But \"most of the time\" is exactly why disputes happen at all: a stain that was or wasn't already there, a button that was or wasn't missing before, a garment that comes back looking different than expected. Without any record of the starting condition, there's no way to actually settle any of it. It just becomes one person's word against another's.",
      },
      { type: "h2", text: "The problem isn't usually bad service. It's no record." },
      {
        type: "p",
        text: "Most disputes in garment care aren't really about incompetence — they're about the absence of any shared reference point. If a delicate zari border frays slightly, was it already fraying? If a jacket comes back with a mark near the collar, was that mark there at drop-off? Neither the customer nor the dry cleaner has anything to point to. Everyone's relying on memory, and memory about a garment from three days ago is not a reliable witness.",
      },
      { type: "h2", text: "A simple fix: photograph the garment at both ends" },
      {
        type: "p",
        text: "The solution doesn't need to be complicated. A photo when the item is collected — showing its condition as received — and a photo once cleaning is finished, before it goes back out for delivery. Two photos, shared with the customer, turn a \"trust me\" situation into something both sides can actually look at.",
      },
      {
        type: "p",
        text: "This isn't a new idea from outside the industry. It's closer to how any accountable service — vehicle repair, courier handling, even hotel check-in — handles condition disputes: document the starting state before anything happens to it.",
      },
      { type: "h2", text: "Why this protects both sides, not just the customer" },
      {
        type: "p",
        text: "It's easy to frame this purely as a customer-trust feature, but it genuinely cuts both ways. A documented starting condition protects the business just as much — if an item arrives already damaged or stained, there's a record showing that, rather than an assumption that anything wrong with the garment happened during cleaning. Transparency isn't a one-way concession. It's the thing that makes the whole exchange fair for whoever's actually telling the truth.",
      },
      { type: "h2", text: "What this looks like at Linen & Leaf" },
      {
        type: "p",
        text: "Every order gets tagged and photographed when it's collected, and photographed again once cleaning is complete — both photos shared directly over WhatsApp, so there's a real record on both ends, not just a claim. No app to download, no separate account to check — just two photos, sent to the same number you booked with.",
      },
      {
        type: "p",
        text: "It's a small habit, honestly. But it's the difference between a dispute that can actually be resolved and one that just becomes an argument.",
      },
      {
        type: "note",
        text: "Curious how this works in practice? [Message us on WhatsApp] — we're happy to walk through it before you book your first pickup.",
      },
    ],
  },
  {
    slug: "bridal-lehenga-dry-cleaning-delhi",
    title: "Safely Dry Cleaning Heavy Bridal Lehengas in Delhi NCR",
    metaTitle: "Safely Dry Cleaning Heavy Bridal Lehengas in Delhi NCR | Linen & Leaf",
    metaDescription:
      "Bridal lehengas combine silk, zari, and delicate embellishment in one garment — which is exactly why they need different handling than everyday clothes. Here's what actually matters.",
    excerpt:
      "Silk, zari, beadwork and net in one garment — each reacting differently to heat and handling. What proper care for bridal wear actually involves.",
    tag: "Occasion Wear",
    date: "September 2026",
    readingTime: "4 min read",
    blocks: [
      {
        type: "p",
        text: "A bridal lehenga usually isn't just an outfit. It's one of the more expensive garment purchases a family makes, often carrying real sentimental weight long after the wedding itself. So when it's time to have one cleaned — after the mehendi stains, the food splatters, a full day and night in it — the anxiety is completely understandable. This isn't a shirt you're handing over. It's something you'd genuinely mind losing.",
      },
      { type: "h2", text: "What actually makes bridal wear different" },
      {
        type: "p",
        text: "A typical lehenga isn't one fabric doing one job. It's usually several: a silk or satin base, a net or georgette dupatta, zari or metallic thread embroidery, sometimes beadwork or sequins layered on top, occasionally contrasting fabric panels stitched together. Each of those elements can react differently to heat, moisture, and handling. What's completely safe for the silk base might not be safe for the zari work sitting on top of it.",
      },
      {
        type: "p",
        text: "That combination is exactly why \"just dry clean it\" isn't quite specific enough advice. The handling has to account for every element on the garment, not just the dominant fabric.",
      },
      { type: "h2", text: "What can actually go wrong" },
      {
        type: "p",
        text: "None of this is exotic — it's mostly a matter of matching the process to the fabric:",
      },
      {
        type: "ul",
        items: [
          "**Colour bleeding** between contrasting panels, especially with unstable dyes on darker or heavily dyed fabrics",
          "**Embellishment coming loose** — zari and beadwork are usually hand or machine stitched onto the base fabric, and vigorous handling can work threads loose over time",
          "**Shrinkage or texture change** in delicate fabrics exposed to the wrong heat or moisture level during cleaning or pressing",
        ],
      },
      {
        type: "p",
        text: "None of these are inevitable. They're what happens when a garment this complex gets treated the same way as an everyday shirt.",
      },
      { type: "h2", text: "What proper handling actually looks like" },
      {
        type: "p",
        text: "The short version: individual attention rather than batch processing. A lehenga with multiple fabric types and embellishment benefits from being assessed on its own — what it's made of, what's attached to it, what needs extra care — rather than going through a standard cycle alongside a stack of everyday clothes.",
      },
      { type: "h2", text: "Our approach at Linen & Leaf" },
      {
        type: "p",
        text: "Heavy or embellished pieces get handled individually rather than batched with regular laundry, and we photograph the garment at pickup and again once cleaning is done — which matters more for a piece like this than almost anything else we handle, given the value and detail involved. If there's a specific concern (an existing loose thread, a stain you're worried about, a fabric combination you're unsure of), it's worth mentioning at drop-off so we can plan the right approach for that specific garment, rather than a generic one.",
      },
      { type: "h2", text: "One practical tip, regardless of who cleans it" },
      {
        type: "p",
        text: "Don't let it sit too long after the wedding. Stains — mehendi, food, makeup — get significantly harder to treat the longer they set into fabric, especially on silk and delicate weaves. If there's any flexibility in timing, sooner is genuinely better than later.",
      },
      {
        type: "note",
        text: "Have a specific piece with a fabric combination you're unsure about? [Message us on WhatsApp] with a photo, and we'll talk through it before you book.",
      },
    ],
  },
  {
    slug: "dry-cleaning-subscription-worth-it",
    title: "Is a Dry Cleaning Subscription Worth It for Busy Professionals?",
    metaTitle: "Is a Dry Cleaning Subscription Worth It for Busy Professionals? | Linen & Leaf",
    metaDescription:
      "Monthly dry-cleaning plans promise savings, but the math only works out for some people. Here's how to actually tell if a subscription is worth it for you.",
    excerpt:
      "Monthly plans sound like savings, but the break-even math is simple — and a lot of people never clear it. Here's how to check.",
    tag: "Plans",
    date: "September 2026",
    readingTime: "3 min read",
    blocks: [
      {
        type: "p",
        text: "Once laundry starts piling up every week without fail — work clothes, weekend errands, the general churn of a busy schedule — a lot of people start wondering if there's a smarter way to pay for it than one order at a time. Monthly dry-cleaning plans are the usual answer that comes up. Whether they're actually worth it is a genuinely different question, and it depends entirely on your own habits, not on how good the plan sounds.",
      },
      { type: "h2", text: "How these plans usually work" },
      {
        type: "p",
        text: "Most dry-cleaning subscriptions follow the same basic shape: pay a flat fee each month, and get an ongoing discount on everything you send in, for as long as you're subscribed. No fixed number of garments included, no complicated points system — just a lower price per order, in exchange for a recurring monthly commitment. The better versions of this let you cancel anytime, with no lock-in period.",
      },
      {
        type: "p",
        text: "That's the model, in general. Whether it saves you money depends entirely on how much you'd be spending without it.",
      },
      { type: "h2", text: "The math that actually matters" },
      {
        type: "p",
        text: "Here's the question a subscription plan is really asking you to answer: is your typical monthly spend high enough that the discount outweighs the fee?",
      },
      {
        type: "p",
        text: "A simple way to check: take the monthly fee, divide it by the discount percentage, and that tells you roughly how much you'd need to spend for the plan to pay for itself. For example — purely as an illustration, not a real offer — if a plan cost ₹500 a month and gave 15% off, you'd need to be spending somewhere around ₹3,300 a month on dry cleaning just to break even. Below that, you're paying more than if you'd just gone order by order. Above it, the plan starts actually saving you money, and the more you use it past that point, the better the math gets.",
      },
      {
        type: "p",
        text: "The trap is signing up because the discount percentage sounds good, without checking whether your actual spending clears that break-even line in the first place.",
      },
      { type: "h2", text: "Who this tends to work well for" },
      {
        type: "p",
        text: "Subscriptions like this make the most sense for genuinely repeat usage — households that send in laundry weekly rather than occasionally, shared accommodations like PGs where multiple people's clothes add up fast, or small offices handling uniforms or work wear regularly. If dry cleaning is currently an occasional, unpredictable expense for you, a subscription is probably solving a problem you don't actually have.",
      },
      { type: "h2", text: "What to check before subscribing to any plan — not just ours" },
      {
        type: "p",
        text: "A few questions are worth asking regardless of which service you're considering:",
      },
      {
        type: "ul",
        items: [
          "Is there a minimum commitment period, or can you cancel anytime?",
          "Does the discount apply to everything, or only certain categories of items?",
          "Is pricing transparent enough that you can actually run the break-even math above?",
        ],
      },
      {
        type: "p",
        text: "A plan that can't answer these clearly is harder to evaluate honestly, discount percentage aside.",
      },
      { type: "h2", text: "Where our plan fits" },
      {
        type: "p",
        text: "We're finalizing the specific tiers and pricing for our own monthly plans, aimed at exactly the repeat households, PGs, and small offices described above. [Message us on WhatsApp] for current details — happy to run the actual numbers against your own usage before you commit to anything.",
      },
      {
        type: "note",
        text: "Not sure if your usage justifies a subscription? Send us a rough idea of what you typically send in per month and we'll tell you honestly whether it makes sense yet.",
      },
    ],
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}
