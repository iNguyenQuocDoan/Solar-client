/*
 * Dữ liệu giả cho luồng khảo sát technician.
 * Màn 8 (/tech/surveys/:id) dựng từ site_survey_task/screen.png.
 * Màn 9 (/tech/surveys/:id/verify) mở rộng thêm khối `verification` ở cuối file.
 * Cả ba màn của luồng dùng chung một survey id nên mọi dữ liệu phải lấy từ đây.
 */

export type SurveyContact = { icon: string; label: string; value: string }

export type SurveyStatTile = { label: string; value: string; unit?: string; caption: string }

export type SurveyPhoto = { id: string; src: string; alt: string; tag: string }

export type SurveyChoice = { value: string; label: string; icon: string; caption: string }

export type SurveySeverity = 'none' | 'light' | 'moderate' | 'heavy'

export type SurveyObstacle = {
  id: string
  icon: string
  /** Màu icon theo thiết kế: secondary cho cây, muted cho ống khói… */
  iconTone: 'primary' | 'secondary' | 'muted'
  title: string
  description: string
  severity: SurveySeverity
}

export type SurveyRecord = {
  id: string
  projectCode: string
  statusLabel: string
  /** Ba trạng thái của dòng autosave trên header card */
  autosave: { initial: string; saving: string; saved: string }
  title: string
  subtitle: string
  contacts: SurveyContact[]
  location: { address: string; meta: string }
  homeowner: {
    title: string
    subtitle: string
    badge: string
    tiles: SurveyStatTile[]
    notes: { title: string; text: string }
    photos: { title: string; hint: string; items: SurveyPhoto[] }
    gis: { title: string; yield: string }
  }
  audit: {
    title: string
    subtitle: string
    grade: string
    area: {
      label: string
      hint: string
      value: number
      step: number
      min: number
      unit: string
      varianceLabel: string
      varianceValue: string
    }
    pitch: {
      label: string
      hint: string
      value: number
      min: number
      max: number
      unit: string
      footnoteLabel: string
      footnoteValue: string
    }
    roof: { label: string; options: SurveyChoice[]; selected: string }
    accessibility: {
      label: string
      ladder: { icon: string; title: string; description: string; badge: string }
      scaffolding: { icon: string; title: string; description: string; enabled: boolean }
    }
    shading: {
      label: string
      hint: string
      options: { value: SurveySeverity; label: string }[]
      items: SurveyObstacle[]
    }
    electrical: {
      label: string
      panel: { icon: string; title: string; description: string; rating: string }
      breaker: {
        question: string
        description: string
        options: { value: BreakerAnswer; label: string }[]
        answer: BreakerAnswer
      }
    }
    recommendation: { label: string; hint: string; text: string; footnote: string }
  }
  dock: {
    icon: string
    title: string
    description: string
    actions: { saveDraft: string; photos: string; submit: string }
  }
  toasts: { draftSaved: string; submitted: string }
}

export type BreakerAnswer = 'yes' | 'no'

/** Bốn mức che bóng dùng chung cho mọi vật cản. */
export const shadingSeverityOptions: { value: SurveySeverity; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'heavy', label: 'Heavy' },
]

export const surveys: SurveyRecord[] = [
  {
    id: 'SS-8842',
    projectCode: 'PROJECT #SS-8842',
    statusLabel: 'Survey In Progress',
    autosave: {
      initial: 'Autosaved 2 mins ago',
      saving: 'Saving changes…',
      saved: 'All changes saved just now',
    },
    title: 'Residential Solar 8.4kW System',
    subtitle: 'On-Site Structural & Electrical Validation',
    contacts: [
      { icon: 'person', label: 'Customer', value: 'Marcus Vance' },
      { icon: 'phone_iphone', label: 'Direct Contact', value: '(555) 349-8201' },
      { icon: 'calendar_clock', label: 'Window Slot', value: 'Today, 10:00 - 12:00 PM' },
    ],
    location: { address: '742 Evergreen Terrace', meta: 'Springfield, Parcel ID #094-11' },
    homeowner: {
      title: 'Homeowner Submission',
      subtitle: 'Self-reported preliminary portal data',
      badge: 'Read-only Reference',
      tiles: [
        { label: 'Submitted Footprint', value: '85', unit: 'm²', caption: 'Reported 12.5m × 6.8m' },
        { label: 'Estimated Tilt', value: '25°', caption: 'Homeowner guesstimate' },
        { label: 'Orientation', value: 'SSE', caption: 'South-Southeast ~155°' },
        { label: 'Roof Material', value: 'Asphalt', caption: 'Architectural shingles' },
      ],
      notes: {
        title: 'Customer Reported Notes',
        text: '“Replaced roof covering 3 years ago after hail storm. Left side has a large mature pine tree from neighbor’s backyard that casts shade until about 10:30 AM in autumn. Electrical box is inside garage.”',
      },
      photos: {
        title: 'Self-Assessment Photos (3)',
        hint: 'Tap to inspect',
        items: [
          {
            id: 'south-face',
            src: '/placeholders/photo-roof.svg',
            alt: 'Mái dốc hai tầng nhìn từ xa dưới nắng sớm',
            tag: 'South Face',
          },
          {
            id: 'breaker',
            src: '/placeholders/photo-panel.svg',
            alt: 'Tủ điện tổng trong gara đang mở cửa',
            tag: 'Breaker',
          },
          {
            id: 'east-yard',
            src: '/placeholders/photo-yard.svg',
            alt: 'Sân bên và cây thông cao đổ bóng lên mái',
            tag: 'East Yard',
          },
        ],
      },
      gis: { title: 'GIS Solar Potential Model', yield: 'Est. 1,420 kWh/kWp' },
    },
    audit: {
      title: 'Technician Verified Audit',
      subtitle: 'Live telemetry and calibrated field entries',
      grade: 'Precision Grade A',
      area: {
        label: 'Verified Usable Area (m²)',
        hint: 'Laser meter linked',
        value: 78.5,
        step: 0.5,
        min: 10,
        unit: 'm²',
        varianceLabel: 'Variance from customer claim:',
        varianceValue: '-6.5 m² (Obstacles excluded)',
      },
      pitch: {
        label: 'Verified Pitch Angle (°)',
        hint: 'Clinometer Sensor',
        value: 28,
        min: 0,
        max: 60,
        unit: 'Degrees',
        footnoteLabel: 'Recommended racking pitch:',
        footnoteValue: '28° Flush mount',
      },
      roof: {
        label: 'Roof Surface Profile',
        selected: 'gable',
        options: [
          { value: 'gable', label: 'Gable', icon: 'roofing', caption: 'Simple dual slope' },
          { value: 'hip', label: 'Hip', icon: 'home', caption: 'Four sloped sides' },
          { value: 'flat', label: 'Flat / Low', icon: 'horizontal_rule', caption: 'Ballast compatible' },
          { value: 'complex', label: 'Complex', icon: 'architecture', caption: 'Multi-valley cut' },
        ],
      },
      accessibility: {
        label: 'Structural Accessibility & Crew Safety',
        ladder: {
          icon: 'height',
          title: 'Ladder Clearance',
          description: 'Direct driveway set up',
          badge: 'Unobstructed',
        },
        scaffolding: {
          icon: 'construction',
          title: 'Scaffolding Mandated',
          description: 'West eaves > 22ft',
          enabled: true,
        },
      },
      shading: {
        label: 'Shading Obstacle Analysis',
        hint: 'Affects inverter architecture',
        options: shadingSeverityOptions,
        items: [
          {
            id: 'pine',
            icon: 'park',
            iconTone: 'secondary',
            title: 'Neighbor Pine (SE)',
            description: '08:00 - 10:45 AM impact',
            severity: 'moderate',
          },
          {
            id: 'chimney',
            icon: 'fireplace',
            iconTone: 'muted',
            title: 'Central Chimney',
            description: '1.2m shadow projection',
            severity: 'light',
          },
          {
            id: 'service-drop',
            icon: 'power',
            iconTone: 'primary',
            title: 'Overhead Service Drop',
            description: 'Passes above North ridge',
            severity: 'none',
          },
        ],
      },
      electrical: {
        label: 'Electrical Infrastructure Check',
        panel: {
          icon: 'electrical_services',
          title: 'Main Service Panel Rating',
          description: 'Square D Homeline, Outdoor enclosure',
          rating: '200 Ampere',
        },
        breaker: {
          question: '40A Double-Pole PV Breaker Space Available?',
          description: 'Slots 22 & 24 currently unoccupied',
          options: [
            { value: 'yes', label: 'YES' },
            { value: 'no', label: 'NO' },
          ],
          answer: 'yes',
        },
      },
      recommendation: {
        label: 'Engineering Recommendation for Sales Desk',
        hint: 'System Design Input',
        text: 'Recommend 22x 400W Monocrystalline panels split across South (14 panels) and West (8 panels) faces. Strongly advocate microinverters (IQ8M) over central string inverter due to morning shadow cast from neighbor mature pine.',
        footnote: 'Flagged automatically to Engineering Planner for single-line diagram generation.',
      },
    },
    dock: {
      icon: 'fact_check',
      title: 'Field Validation: 6 of 6 Sections Complete',
      description: 'Ready for documentation sign-off',
      actions: {
        saveDraft: 'Save Draft',
        photos: 'Photo Documentation',
        submit: 'Submit to Sales',
      },
    },
    toasts: {
      draftSaved: 'Draft saved to the offline field cache.',
      submitted: 'Survey #SS-8842 verified and forwarded to Engineering & Sales desk.',
    },
  },
]

export function getSurveyById(id: string | undefined): SurveyRecord | undefined {
  return surveys.find((survey) => survey.id === id)
}

/* ------------------------------------------------------------------------------------------------
 * Màn 9 – /tech/surveys/:id/verify (site_survey_verification)
 * Phần mở rộng, không sửa dữ liệu của màn 8. Mọi con số đo đạc suy ra từ `surveys` ở trên để ba màn
 * của cùng một survey không mâu thuẫn (xem ghi chú từng field).
 * ---------------------------------------------------------------------------------------------- */

export type SurveyRafterCondition = 'excellent' | 'good' | 'reinforce'
export type SurveyRiskLevel = 'low' | 'moderate' | 'high'

export type SurveyRadioOption<T extends string> = { value: T; label: string; description?: string }

export type SurveyVerification = {
  breadcrumbRoot: { icon: string; label: string }
  syncLabel: string
  statusLabel: string
  cluster: string
  assignee: string
  meta: { icon: string; tone: 'primary' | 'secondary'; text: string }[]
  headerActions: { reject: string; saveDraft: string; complete: string }
  baseline: {
    title: string
    subtitle: string
    badge: string
    blueprint: {
      label: string
      length: string
      width: string
      area: string
      /** Phần trăm thanh tiến trình dưới số đo */
      progress: number
      caption: string
    }
    metrics: { icon: string; label: string; value: string; caption: string }[]
    material: { icon: string; title: string; description: string; badge: string }
    /** `photoId` trỏ sang homeowner.photos.items để hai màn dùng đúng một bộ ảnh */
    photos: { title: string; count: string; items: { photoId: string; caption: string }[] }
    note: string
  }
  safety: { title: string; items: { id: string; label: string; checked: boolean }[] }
  dimensions: {
    title: string
    subtitle: string
    badge: string
    length: { label: string; value: string; footnote: string }
    width: { label: string; value: string; footnote: string }
    area: { label: string; unit: string; footnote: string }
    tilt: { label: string; syncLabel: string; value: string; footnote: string }
    azimuth: { label: string; value: string; footnote: string }
    rafter: {
      label: string
      options: SurveyRadioOption<SurveyRafterCondition>[]
      value: SurveyRafterCondition
    }
  }
  accessibility: {
    title: string
    subtitle: string
    badge: string
    shading: { label: string; hint: string; value: string }
    panel: { label: string; value: string }
    conduit: { label: string; value: string }
    access: { label: string; icon: string; value: string }
  }
  proposal: {
    title: string
    subtitle: string
    badge: string
    capacity: { label: string; value: string; caption: string }
    inverter: { label: string; value: string; caption: string }
    notes: { label: string; value: string }
    risk: { label: string; options: SurveyRadioOption<SurveyRiskLevel>[]; value: SurveyRiskLevel }
  }
  dock: { uploadLabel: string; uploadCount: number; photoHint: string; saveDraft: string; complete: string }
  signOff: {
    title: string
    subtitle: string
    technicianLabel: string
    technician: string
    areaLabel: string
    capacityLabel: string
    capacity: string
    panelLabel: string
    panel: string
    signatureLabel: string
    signatureHint: string
    cancel: string
    confirm: string
  }
  reject: {
    title: string
    description: string
    label: string
    options: string[]
    cancel: string
    confirm: string
  }
  toasts: { draftSaved: string; transmitted: string; rejected: string; tiltSynced: string }
}

const surveyVerifications: Record<string, SurveyVerification> = {
  'SS-8842': {
    breadcrumbRoot: { icon: 'roofing', label: 'Field Surveys' },
    syncLabel: 'Saved 2 mins ago (Local & Cloud synced)',
    statusLabel: 'In Progress',
    cluster: 'NorCal Metro Cluster 04',
    assignee: 'Assigned: Marcus Vance (Lead Tech)',
    meta: [
      { icon: 'location_on', tone: 'primary', text: '742 Evergreen Terrace, Springfield' },
      { icon: 'call', tone: 'primary', text: '(555) 349-8201' },
      { icon: 'schedule', tone: 'secondary', text: 'Today, 10:00 AM (In-home window)' },
    ],
    headerActions: {
      reject: 'Reject / Impasse',
      saveDraft: 'Save Draft',
      complete: 'Complete & Sign Survey',
    },
    baseline: {
      title: 'Customer Baseline',
      subtitle: 'Submitted via Solar Portal on May 12',
      badge: 'Self-Reported',
      blueprint: {
        label: 'Roof Blueprint Est.',
        // 12.5m × 6.8m ≈ 41ft × 22ft ≈ 915 sq ft, khớp "85 m²" ở màn 8
        length: '41 ft',
        width: '22 ft',
        area: '~915 sq ft',
        progress: 88,
        caption: 'Estimated continuous roof plane over primary structure',
      },
      metrics: [
        { icon: 'explore', label: 'Orientation', value: '155° SSE', caption: 'South-Southeast' },
        { icon: 'change_history', label: 'Tilt Slope', value: '25°', caption: 'Pitch: 5.6/12' },
      ],
      material: {
        icon: 'roofing',
        title: 'Architectural Asphalt Shingle',
        // Ghi chú của chủ nhà ở màn 8: lợp lại mái 3 năm trước
        description: 'Installed 3 yrs ago, Expected life 25y',
        badge: 'Confirmed',
      },
      photos: {
        title: 'Customer Uploaded Photos',
        count: '3 Assets',
        items: [
          { photoId: 'south-face', caption: 'Front Roofline View' },
          { photoId: 'breaker', caption: 'Main Electrical Panel (200A)' },
          { photoId: 'east-yard', caption: 'East Yard & Pine Line' },
        ],
      },
      note: 'Customer requested maximizing west-south coverage to offset peak summer utility tariffs. Verify rafter spacing near vent pipe.',
    },
    safety: {
      title: 'Field Safety & Access',
      items: [
        { id: 'ppe', label: 'PPE Check: Fall arrest harness inspected & secured', checked: true },
        { id: 'gfci', label: 'Ground-Fault detector & voltage tester zeroed', checked: true },
        { id: 'deadfront', label: 'Customer notified prior to main panel deadfront removal', checked: true },
      ],
    },
    dimensions: {
      title: 'Verified Roof & Surface Dimensions',
      subtitle: 'Calibrated on-roof measurements',
      badge: 'Live Laser Sync',
      // 40.5 × 20.9 ≈ 846 sq ft ≈ 78.5 m² – đúng "Verified Usable Area" của màn 8
      length: { label: 'Usable Length (ft)', value: '40.5', footnote: 'Customer baseline: 41 ft' },
      width: { label: 'Usable Width (ft)', value: '20.9', footnote: 'Cutback from eaves: 2 ft' },
      area: { label: 'Net Usable Area', unit: 'SQ FT', footnote: 'Accommodates > 22 modules' },
      tilt: {
        label: 'Measured Slope / Tilt',
        syncLabel: 'Sync Inclinometer',
        // Màn 8 chốt pitch 28°, baseline 25° → lệch +3°
        value: '28°',
        footnote: 'Variance: +3° from customer estimate',
      },
      azimuth: {
        label: 'Measured Azimuth / Direction',
        value: '159° SSE',
        footnote: 'Magnetic declination applied: +4.2°',
      },
      rafter: {
        label: 'Roof Condition & Rafter Spacing',
        value: 'excellent',
        options: [
          { value: 'excellent', label: 'Excellent (24" rafters)', description: 'Engineered trusses' },
          { value: 'good', label: 'Good (16" rafters)', description: 'Standard 2x4 framing' },
          { value: 'reinforce', label: 'Needs Reinforcement', description: 'Attic sistering req.' },
        ],
      },
    },
    accessibility: {
      title: 'Accessibility & Obstacles',
      subtitle: 'Site constraints, shading & interconnection paths',
      badge: 'Utility Code Compliant',
      shading: {
        label: 'Shading Analysis & SunEye Horizon',
        hint: '<4% Loss Est.',
        // Ba vật cản của màn 8: thông hàng xóm (sáng), ống khói, dây điện trên cao
        value:
          'Morning shading only - neighbor pine (SE) casts shadow until 10:45 AM, central chimney adds 1.2m projection, overhead service drop clear of array.',
      },
      panel: {
        label: 'Electrical Service Panel Rating',
        value: '200A Main Breaker, slots 22 & 24 free - Solar ready',
      },
      conduit: { label: 'Conduit Run Distance', value: 'Estimated 35 ft to inverter location' },
      access: {
        label: 'Roof Access Points & Staging Area',
        icon: 'stairs',
        value: 'Direct driveway ladder set up (flat paved pathway, clear of the North ridge service drop)',
      },
    },
    proposal: {
      title: 'Technician Installation Proposal',
      subtitle: 'Engineering recommendation pushed directly to Sales CAD team',
      badge: 'Sales Fast-Track',
      capacity: {
        label: 'Recommended System Capacity',
        // Màn 8: 22 tấm 400W; GIS 1,420 kWh/kWp × 8.8 kW ≈ 12,400 kWh/năm
        value: '8.8 kW DC (22x 400W Tier-1 Panels)',
        caption: 'Est. Production: 12,400 kWh/yr',
      },
      inverter: {
        label: 'Suggested Inverter Architecture',
        value: 'Enphase Microinverters IQ8M',
        caption: 'Alt: SolarEdge HD-Wave w/ P401 Opt.',
      },
      notes: {
        label: 'Field Structural & Engineering Notes',
        value:
          'Clean structural rafters, no reinforcement required, excellent solar irradiance window. Easy ground-rod tie-in.',
      },
      risk: {
        label: 'Technical Risk Assessment',
        value: 'low',
        options: [
          { value: 'low', label: 'Low Risk' },
          { value: 'moderate', label: 'Moderate' },
          { value: 'high', label: 'High (Needs PE Review)' },
        ],
      },
    },
    dock: {
      uploadLabel: 'Upload Survey Photos',
      // Bằng số ảnh đã chụp trong lib/mock/surveyPhotos.ts của cùng survey
      uploadCount: 6,
      photoHint: 'All minimum photo requirements met',
      saveDraft: 'Save Draft',
      complete: 'Complete Survey & Send to Sales',
    },
    signOff: {
      title: 'Field Verification Sign-off',
      subtitle: 'NorCal Metro Field Operations Certification',
      technicianLabel: 'Technician:',
      technician: 'Marcus Vance (ID: TECH-772)',
      areaLabel: 'Net Verified Roof Area:',
      capacityLabel: 'Recommended Capacity:',
      capacity: '8.8 kW DC (Tier-1)',
      panelLabel: 'Panel Condition:',
      panel: '200A Busbar / Solar Ready',
      signatureLabel: 'Technician Digital Signature',
      signatureHint: 'Touch / Stylus Active',
      cancel: 'Back to Editing',
      confirm: 'Transmit to Sales CAD',
    },
    reject: {
      title: 'Flag Impasse / Survey Rejected',
      description:
        'Please indicate the blocking reason. This stops the automated sales proposal and sends a red flag to project planning.',
      label: 'Blocking reason',
      options: [
        'Roof Sheathing / Trusses Structurally Degraded',
        'Utility Point of Interconnection Unsafe / Heavy Shading',
        'HOA Restrictions / Severe Physical Obstructions',
        'Customer Cancelled / Access Refused',
      ],
      cancel: 'Cancel',
      confirm: 'Confirm Impasse',
    },
    toasts: {
      draftSaved: 'Survey draft autosaved to field edge storage',
      transmitted: 'Survey SS-8842 verified and transmitted to Sales CAD.',
      rejected: 'Impasse flagged to project planning.',
      tiltSynced: 'Inclinometer reading synced from the field sensor.',
    },
  },
}

export function getSurveyVerificationById(id: string | undefined): SurveyVerification | undefined {
  return id ? surveyVerifications[id] : undefined
}
