import { defineQuery } from "next-sanity";

export const STARTUPS_QUERY = defineQuery(
    `*[_type == 'startup' && defined(slug.current)] | order(_createdAt desc) {
  _id, slug, title, _createdAt, author -> {
    _id, name, image, bio
  },
     views, description, category, image
}`
)