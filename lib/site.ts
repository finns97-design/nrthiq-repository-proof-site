// What this site is, said once.
//
// THIS IS A TEST FIXTURE. It exists so NRTHIQ can prove, on a real repository
// and a real public deployment, that a page it commits is the page that is
// served. It is not a business, and every page says so.
export const site = {
  name: "Proof Site Plumbing",
  notice: "This is a test site used to verify NRTHIQ's publishing. It is not a real business, and nothing here is an offer of service.",
  // NOT INDEXED while it is a fixture: a made-up business has no place in a search index.
  // Set to true only for a proof that needs an indexable page, and set it back.
  indexable: false,
} as const;
