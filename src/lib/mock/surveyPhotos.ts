/*
 * Dữ liệu giả cho /tech/surveys/:id/photos – dựng từ survey_image_documentation/screen.png.
 * Dùng chung survey id với lib/mock/surveys.ts (SS-8842): mã dự án, khách hàng, địa chỉ, thông số
 * mái và tủ điện phải khớp với màn 8 và màn 9.
 *
 * Số ảnh bắt buộc và tiến độ KHÔNG hard-code: `getSurveyPhotoProgress` tính lại từ `sections`
 * để thanh tiến độ, số "critical shots remaining" và nhãn ở dock không bao giờ lệch nhau.
 */

export type PhotoTagTone = 'verified' | 'warning'

export type SurveyPhotoAsset = {
  id: string
  src: string
  alt: string
  tag: { label: string; icon: string; tone: PhotoTagTone }
  time: string
  gpsTagged: boolean
  title: string
  note: string
  inspector: {
    coordinates: string
    timestamp: string
    elevation: string
    lens: string
    annotations: number
    notes: string
  }
}

export type SurveyPhotoDropzone = {
  id: string
  icon: string
  title: string
  /** Dòng đỏ khi còn góc chụp bắt buộc */
  requirement?: string
  hint: string
  actionLabel: string
  actionIcon: string
  required: boolean
}

export type SurveyPhotoSection = {
  id: string
  icon: string
  /** Màu ô icon của mỗi section theo thiết kế */
  iconTone: 'primary' | 'secondary' | 'tertiary' | 'neutral'
  title: string
  description: string
  /** Số ảnh bắt buộc; 0 = section tuỳ chọn */
  requiredCount: number
  requirementLabel: string
  requirementTone: 'error' | 'success' | 'neutral'
  photos: SurveyPhotoAsset[]
  dropzones: SurveyPhotoDropzone[]
}

export type SurveyPhotoDoc = {
  surveyId: string
  header: {
    projectRef: string
    customer: string
    address: string
    title: string
    badge: string
    actions: { batch: string; camera: string; verifyAll: string }
  }
  progress: {
    title: string
    /** "{n} of {m} required site photos captured" */
    capturedTemplate: string
    completeTemplate: string
    remainingTemplate: string
    optionalLabel: string
  }
  inspector: {
    title: string
    badge: string
    annotationLabel: string
    editTitleLabel: string
    coordinatesLabel: string
    timestampLabel: string
    elevationLabel: string
    lensLabel: string
    notesLabel: string
    removeLabel: string
    saveLabel: string
    annotationText: string
    tools: { icon: string; label: string }[]
  }
  tip: { icon: string; title: string; text: string }
  sections: SurveyPhotoSection[]
  dock: {
    icon: string
    title: string
    descriptionTemplate: string
    saveDraft: string
    complete: string
  }
  toasts: { saved: string; completed: string; verifiedAll: string; annotationSaved: string }
}

const surveyPhotoDocs: Record<string, SurveyPhotoDoc> = {
  'SS-8842': {
    surveyId: 'SS-8842',
    header: {
      projectRef: 'Project Ref #SS-8842',
      customer: 'Marcus Vance Residence',
      address: '742 Evergreen Terrace, Springfield',
      title: 'Step 2 of 2: Photographic Evidence & Site Audit',
      badge: 'Field Verification',
      actions: { batch: 'Batch Upload', camera: 'Camera Capture', verifyAll: 'Mark All Verified' },
    },
    progress: {
      title: 'Audit Completeness Target',
      capturedTemplate: '{captured} of {required} required site photos captured',
      completeTemplate: '{percent}% Complete',
      remainingTemplate: '{remaining} critical shots remaining',
      optionalLabel: 'optional',
    },
    inspector: {
      title: 'Photo Inspector',
      badge: 'Active Review',
      annotationLabel: '{count} Annotations Present',
      editTitleLabel: 'Edit Title',
      coordinatesLabel: 'Coordinates:',
      timestampLabel: 'Timestamp:',
      elevationLabel: 'EXIF Elevation:',
      lensLabel: 'Lens Focal:',
      notesLabel: 'Field Notes & Observations',
      removeLabel: 'Remove Photo',
      saveLabel: 'Save Annotations',
      annotationText: 'Pitch Rafter Align',
      tools: [
        { icon: 'edit', label: 'Pen Marker' },
        { icon: 'arrow_right_alt', label: 'Arrow Pointer' },
        { icon: 'straighten', label: 'Measurement Tool' },
        { icon: 'delete', label: 'Clear Markup' },
      ],
    },
    tip: {
      icon: 'lightbulb',
      title: 'Auditor Guideline Tip',
      text: 'Ensure electrical rating plaques are free from flash glare.',
    },
    sections: [
      {
        id: 'roof',
        icon: 'roofing',
        iconTone: 'primary',
        title: 'Section A: Roof & Mounting Surface',
        description: 'Inspect slope pitch, shingle wear, valleys, rafter integrity, and structural soundings.',
        requiredCount: 3,
        requirementLabel: 'Min 3 Required',
        requirementTone: 'error',
        photos: [
          {
            id: 'south-face',
            src: '/placeholders/photo-roof.svg',
            alt: 'Mái ngói nhựa đường chụp chéo từ trên cao dưới nắng trưa',
            tag: { label: 'South Face', icon: 'verified', tone: 'verified' },
            time: '10:14 AM',
            gpsTagged: true,
            title: 'South Face Overview',
            // Độ dốc 28° khớp "Verified Pitch Angle" của màn 8
            note: 'Shingle condition sound, 28° slope',
            inspector: {
              coordinates: '37.3382° N, 121.8863° W',
              timestamp: 'Today, 10:14 AM',
              elevation: '82m ASL',
              lens: '24mm (f/1.8)',
              annotations: 2,
              notes:
                'Shingle condition sound with minimal granulate loss. 28 degree pitch confirmed with inclinometer. Framing rafter spacing appears standard 24-inch on-center.',
            },
          },
          {
            id: 'east-valley',
            src: '/placeholders/photo-valley.svg',
            alt: 'Máng thoát nước giữa hai mái với tôn chống thấm sạch',
            tag: { label: 'East Valley', icon: 'verified', tone: 'verified' },
            time: '10:21 AM',
            gpsTagged: true,
            title: 'East Ridge & Valley',
            note: 'Clean valley, zero flashing corrosion',
            inspector: {
              coordinates: '37.3384° N, 121.8860° W',
              timestamp: 'Today, 10:21 AM',
              elevation: '82m ASL',
              lens: '24mm (f/1.8)',
              annotations: 0,
              notes: 'Clean valley clearance, flashing intact with no signs of dry rot.',
            },
          },
        ],
        dropzones: [
          {
            id: 'roof-slot-3',
            icon: 'add_a_photo',
            title: 'Add Roof Photo',
            requirement: '1 mandatory angle needed',
            hint: 'West rake edge or attic truss',
            actionLabel: 'Select File',
            actionIcon: 'upload_file',
            required: true,
          },
        ],
      },
      {
        id: 'electrical',
        icon: 'bolt',
        iconTone: 'secondary',
        title: 'Section B: Electrical Panel & Meter',
        description:
          'Inspect service drop, utility meter reading, main busbar ratings, and grounding rod connection.',
        requiredCount: 2,
        requirementLabel: 'Min 2 Required (Fulfilled)',
        requirementTone: 'success',
        photos: [
          {
            id: 'panel-exterior',
            src: '/placeholders/photo-panel.svg',
            alt: 'Tủ điện ngoài trời với khoảng trống thao tác phía trước',
            tag: { label: 'Exterior & Clearances', icon: 'verified', tone: 'verified' },
            time: '10:32 AM',
            gpsTagged: true,
            title: 'Main Service Panel Exterior',
            note: '36in working clearance verified compliant',
            inspector: {
              coordinates: '37.3381° N, 121.8865° W',
              timestamp: 'Today, 10:32 AM',
              elevation: '78m ASL',
              lens: '24mm (f/2.0)',
              annotations: 1,
              notes:
                'Outdoor enclosure in good condition. 36 inch working clearance measured in front of the deadfront.',
            },
          },
          {
            id: 'busbar',
            src: '/placeholders/photo-breaker.svg',
            alt: 'Nhãn thanh cái và cầu dao tổng 200A trong tủ điện',
            tag: { label: '200A Main Breaker', icon: 'verified', tone: 'verified' },
            time: '10:35 AM',
            gpsTagged: true,
            title: 'Busbar Label & 200A Breaker',
            // Khớp "200 Ampere / slots 22 & 24" ở màn 8 và màn 9
            note: '200A breaker / 225A bus rating confirmed',
            inspector: {
              coordinates: '37.3381° N, 121.8865° W',
              timestamp: 'Today, 10:35 AM',
              elevation: '78m ASL',
              lens: '35mm (f/2.8)',
              annotations: 1,
              notes:
                'Square D Homeline busbar rated 225A with a 200A main. Slots 22 and 24 are free for the 40A double-pole PV breaker.',
            },
          },
        ],
        dropzones: [
          {
            id: 'electrical-aux',
            icon: 'add',
            title: '+ Add Auxiliary Photo',
            hint: 'Ground rod or sub-panel shots',
            actionLabel: 'Upload Optional',
            actionIcon: 'add_circle',
            required: false,
          },
        ],
      },
      {
        id: 'conduit',
        icon: 'alt_route',
        iconTone: 'tertiary',
        title: 'Section C: Inverter & Conduit Path',
        description: 'Map EMT / PVC run routes from rooftop junction box to inverter and battery disconnect.',
        requiredCount: 2,
        requirementLabel: 'Min 2 Required',
        requirementTone: 'error',
        photos: [
          {
            id: 'inverter-mount',
            src: '/placeholders/photo-inverter.svg',
            alt: 'Vị trí gắn inverter trên tường ngoài gara',
            tag: { label: 'Proposed Inverter', icon: 'verified', tone: 'verified' },
            time: '10:48 AM',
            gpsTagged: true,
            title: 'Garage Exterior Inverter Mount',
            note: 'Garage north wall, 48in clearance',
            inspector: {
              coordinates: '37.3380° N, 121.8866° W',
              timestamp: 'Today, 10:48 AM',
              elevation: '78m ASL',
              lens: '24mm (f/1.8)',
              annotations: 0,
              // Khớp đề xuất microinverter IQ8M của màn 8 và màn 9
              notes:
                'North garage wall clear for the IQ8M combiner. Estimated 35 ft conduit run back to the main service panel.',
            },
          },
        ],
        dropzones: [
          {
            id: 'conduit-route',
            icon: 'route',
            title: '+ Add Conduit Route Photo',
            requirement: '1 mandatory angle needed',
            hint: 'Eaves transition or attic penetration',
            actionLabel: 'Upload Conduit Path',
            actionIcon: 'upload_file',
            required: true,
          },
          {
            id: 'attic-interior',
            icon: 'add',
            title: 'Add Attic Interior',
            hint: 'Rafter framing & insulation',
            actionLabel: 'Add Optional',
            actionIcon: 'add_circle',
            required: false,
          },
        ],
      },
      {
        id: 'shading',
        icon: 'nature',
        iconTone: 'neutral',
        title: 'Section D: Shading & Obstacles',
        description:
          'Record nearby mature trees, dormers, chimneys, and vent pipes causing potential production shade.',
        requiredCount: 0,
        requirementLabel: 'Optional / As Needed',
        requirementTone: 'neutral',
        photos: [
          {
            id: 'neighbor-pine',
            src: '/placeholders/photo-tree.svg',
            alt: 'Tán thông cao nhìn từ dưới lên, cạnh mái nhà hai tầng',
            // Màn 8 ghi vật cản là "Neighbor Pine (SE)" che bóng buổi sáng
            tag: { label: 'Obstacle Note', icon: 'warning', tone: 'warning' },
            time: '10:55 AM',
            gpsTagged: true,
            title: 'Neighbor Pine (SE 15ft)',
            note: 'Foliage shades array until 10:45 AM',
            inspector: {
              coordinates: '37.3380° N, 121.8859° W',
              timestamp: 'Today, 10:55 AM',
              elevation: '80m ASL',
              lens: '16mm (f/2.8)',
              annotations: 1,
              notes:
                'Mature pine 15 ft south-east induces moderate morning shading on string array 2 from 08:00 until roughly 10:45 AM. Microinverters recommended.',
            },
          },
        ],
        dropzones: [
          {
            id: 'shading-add',
            icon: 'add_photo_alternate',
            title: '+ Add Shading Element',
            hint: 'Chimney, vent stack, neighboring ridge',
            actionLabel: 'Upload Photo',
            actionIcon: 'add',
            required: false,
          },
        ],
      },
    ],
    dock: {
      icon: 'sync_saved_locally',
      title: 'Auto-Sync Online',
      descriptionTemplate:
        'All {total} captured images backed up to secure field storage. Complete {remaining} remaining required photos to finalize site handoff.',
      saveDraft: 'Save Draft',
      complete: 'Save & Complete Site Documentation',
    },
    toasts: {
      saved: 'Draft saved to the offline field cache.',
      completed: 'Site documentation for SS-8842 handed off to Sales CAD.',
      verifiedAll: 'All captured photos marked as verified.',
      annotationSaved: 'Annotations saved to this photo.',
    },
  },
}

export type SurveyPhotoProgress = {
  /** Tổng số ảnh đã chụp, gồm cả section tuỳ chọn */
  total: number
  /** Số ảnh bắt buộc đã chụp / cần chụp */
  captured: number
  required: number
  percent: number
  remaining: number
  /** "Section A (2/3), Section B (2/2), …" */
  breakdown: string
}

/** Tính lại tiến độ từ `sections` để các con số trên trang luôn khớp nhau. */
export function getSurveyPhotoProgress(doc: SurveyPhotoDoc): SurveyPhotoProgress {
  let total = 0
  let captured = 0
  let required = 0
  const parts: string[] = []

  for (const section of doc.sections) {
    const shots = section.photos.length
    total += shots
    const letter = section.title.split(':')[0] ?? section.title
    if (section.requiredCount > 0) {
      captured += Math.min(shots, section.requiredCount)
      required += section.requiredCount
      parts.push(`${letter} (${shots}/${section.requiredCount})`)
    } else {
      parts.push(`${letter} (${shots} ${doc.progress.optionalLabel})`)
    }
  }

  return {
    total,
    captured,
    required,
    percent: required === 0 ? 100 : Math.round((captured / required) * 100),
    remaining: Math.max(0, required - captured),
    breakdown: parts.join(', '),
  }
}

export function getSurveyPhotoDocById(id: string | undefined): SurveyPhotoDoc | undefined {
  return id ? surveyPhotoDocs[id] : undefined
}

export function findSurveyPhotoById(doc: SurveyPhotoDoc, photoId: string): SurveyPhotoAsset | undefined {
  for (const section of doc.sections) {
    const photo = section.photos.find((candidate) => candidate.id === photoId)
    if (photo) return photo
  }
  return undefined
}

/** Ảnh mở sẵn trong Photo Inspector khi vào trang. */
export function getFirstSurveyPhoto(doc: SurveyPhotoDoc): SurveyPhotoAsset | undefined {
  return doc.sections.flatMap((section) => section.photos)[0]
}
