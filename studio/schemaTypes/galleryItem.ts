import {defineField, defineType} from 'sanity'

export const galleryItem = defineType({
  name: 'galleryItem',
  title: 'Gallery',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Gallery Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'mediaType',
      title: 'Media Type',
      type: 'string',
      initialValue: 'image',
      options: {
        layout: 'radio',
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
      },
      description: 'Choose Image for photos/pictures or Video for short cleaning clips.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Home Cleaning', value: 'home'},
          {title: 'Office Cleaning', value: 'office'},
          {title: 'Car Cleaning', value: 'car'},
          {title: 'Equipment', value: 'equipment'},
          {title: 'Before & After', value: 'before-after'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Gallery Image',
      type: 'image',
      options: {hotspot: true},
      description:
        'Use this for normal image gallery items only. For Before & After, upload the Before Image and After Image below.',
      hidden: ({parent}) => parent?.mediaType === 'video' || parent?.category === 'before-after',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string; category?: string}

          if (parent?.mediaType === 'image' && parent?.category !== 'before-after' && !value) {
            return 'Gallery Image is required for normal image gallery items.'
          }

          return true
        }),
    }),

    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Required when Category is Before & After.',
      hidden: ({parent}) => parent?.mediaType === 'video' || parent?.category !== 'before-after',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string; category?: string}

          if (parent?.mediaType === 'image' && parent?.category === 'before-after' && !value) {
            return 'Before Image is required for Before & After gallery items.'
          }

          return true
        }),
    }),

    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: {hotspot: true},
      description: 'Required when Category is Before & After.',
      hidden: ({parent}) => parent?.mediaType === 'video' || parent?.category !== 'before-after',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string; category?: string}

          if (parent?.mediaType === 'image' && parent?.category === 'before-after' && !value) {
            return 'After Image is required for Before & After gallery items.'
          }

          return true
        }),
    }),

    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Paste a video link if Media Type is Video.',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as {mediaType?: string}

          if (parent?.mediaType === 'video' && !value) {
            return 'Video URL is required when Media Type is Video.'
          }

          return true
        }),
    }),

    defineField({
      name: 'tag',
      title: 'Small Tag Label',
      type: 'string',
      description: 'Example: Equipment, Office Cleaning, Before & After Result',
    }),

    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    }),

    defineField({
      name: 'isVisible',
      title: 'Show on Website',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      mediaType: 'mediaType',
      image: 'image',
      beforeImage: 'beforeImage',
      afterImage: 'afterImage',
    },
    prepare({title, category, mediaType, image, beforeImage, afterImage}) {
      return {
        title,
        subtitle:
          category === 'before-after'
            ? 'Before & After'
            : mediaType === 'video'
              ? 'Video'
              : 'Image',
        media: afterImage || beforeImage || image,
      }
    },
  },
})
