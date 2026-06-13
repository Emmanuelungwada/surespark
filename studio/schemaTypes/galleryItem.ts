import {defineField, defineType} from 'sanity'

const MAX_VIDEO_SIZE = 20 * 1024 * 1024
const MAX_IMAGE_SIZE = 3 * 1024 * 1024

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
      description: 'Choose Image for photos/pictures or Video for short cleaning clips.',
      initialValue: 'image',
      options: {
        layout: 'radio',
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Gallery Image',
      type: 'image',
      description:
        'Upload JPG, PNG, or WebP. Recommended size: 1200px wide, under 1 MB if possible. Maximum allowed size: 3 MB. Required when Media Type is Image.',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType === 'video',
      validation: (Rule) =>
        Rule.custom(async (image, context) => {
          const parent = context.parent as {mediaType?: string}

          if ((parent?.mediaType || 'image') === 'image' && !image) {
            return 'Gallery Image is required when Media Type is Image.'
          }

          const assetRef = (image as {asset?: {_ref?: string}})?.asset?._ref

          if (!assetRef) {
            return true
          }

          const client = context.getClient({apiVersion: '2025-06-01'})
          const asset = await client.fetch(
            '*[_id == $assetRef][0]{size, mimeType}',
            {assetRef},
          )

          if (asset?.size && asset.size > MAX_IMAGE_SIZE) {
            return 'Image is too large. Maximum allowed size is 3 MB. Please compress the image before uploading.'
          }

          return true
        }),
    }),

    defineField({
      name: 'videoFile',
      title: 'Gallery Video',
      type: 'file',
      description:
        'Upload MP4 only. Recommended: 720p, 10–30 seconds, under 10–15 MB for faster mobile loading. Maximum allowed size: 20 MB.',
      options: {
        accept: 'video/mp4',
      },
      hidden: ({parent}) => parent?.mediaType !== 'video',
      validation: (Rule) =>
        Rule.custom(async (file, context) => {
          const parent = context.parent as {mediaType?: string}

          if (parent?.mediaType !== 'video') {
            return true
          }

          if (!file) {
            return 'Gallery Video is required when Media Type is Video.'
          }

          const assetRef = (file as {asset?: {_ref?: string}})?.asset?._ref

          if (!assetRef) {
            return true
          }

          const client = context.getClient({apiVersion: '2025-06-01'})
          const asset = await client.fetch(
            '*[_id == $assetRef][0]{size, mimeType}',
            {assetRef},
          )

          if (asset?.mimeType && asset.mimeType !== 'video/mp4') {
            return 'Only MP4 videos are allowed. Please upload an MP4 file.'
          }

          if (asset?.size && asset.size > MAX_VIDEO_SIZE) {
            return 'Video is too large. Maximum allowed size is 20 MB. Please upload a shorter/compressed MP4 video.'
          }

          return true
        }),
    }),

    defineField({
      name: 'videoThumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      description:
        'Recommended for videos. Upload JPG, PNG, or WebP. Recommended size: 1200px wide, under 1 MB if possible. This image will be used as the video preview later.',
      options: {hotspot: true},
      hidden: ({parent}) => parent?.mediaType !== 'video',
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
})
