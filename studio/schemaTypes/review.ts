import {defineField, defineType} from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Reviews',
  type: 'document',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Customer Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'serviceUsed',
      title: 'Service Used',
      type: 'string',
      description: 'Example: Home Cleaning, Office Cleaning, Car Cleaning',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      initialValue: 5,
      validation: (Rule) => Rule.min(1).max(5),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'Example: Lagos, Abuja',
    }),
    defineField({
      name: 'reviewText',
      title: 'Review Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),
    defineField({
      name: 'isApproved',
      title: 'Approved / Show on Website',
      type: 'boolean',
      initialValue: false,
      description: 'Only approved reviews should show on the website.',
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
})
