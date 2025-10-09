let rPelvis, rSpine, rTorso, rSkull, rBlade;
let imgPelvisSmall = [];
let imgPelvisMedium = [];
let imgPelvisLarge = [];
let imgSpine = [];
let imgTorsoSmall = []; // New: Declare array for small torso images
let imgTorsoMedium = []; // New: Declare array for medium torso images
let imgTorsoLarge = []; // New: Declare array for large torso images
let imgSkulls = [];
let imgSkullsSmall = []; // NEW: Declare array for small skull images
let imgSkullsMedium = []; // NEW: Declare array for medium skull images
let imgSkullsLarge = []; // NEW: Declare array for large skull images
let imgJaws = [];
let imgMarks = []; // Assuming 'chips' are 'marks'
let imgNoses = [];
let imgEyes = [];
let imgPupils = []; // New: Declare array for pupil images
let imgLegsBackSmall = []; // NEW: Declare array for small back leg images
let imgLegsBackMedium = []; // NEW: Declare array for medium back leg images
let imgLegsBackLarge = []; // NEW: Declare array for large back leg images
let imgLegsFrontSmall = []; // NEW: Declare array for small front leg images
let imgLegsFrontMedium = []; // NEW: Declare array for medium front leg images
let imgLegsFrontLarge = []; // NEW: Declare array for large front leg images
let imgBlades = []; // New: Declare array for blade images
let imgArmsBack = []; // NEW: Declare array for back arm images
let imgArmsBack_1h = []; // NEW: Declare array for 1-hand back arm images
let imgArmsFrontIdle = []; // NEW: Declare array for front arm idle images
let imgArmsFrontExpress = []; // NEW: Declare array for front arm express images
let imgArmsFrontInteract = []; // NEW: Declare array for front arm interact images
let imgArmsFrontPhone = []; // NEW: Declare array for front arm phone images
let imgArmsBackHello = []; // NEW: Declare array for back arm hello images

// NEW: Variable to hold the loaded asset library JSON data
let assetLibraryData;

// --- LOADING TRACKING VARIABLES ---
let totalAssetsToLoad = 0;
let assetsLoadedCount = 0;
let assetsLoadingComplete = false;
// ----------------------------------

// --- JUNO RECIPE TUNEABLE VARIABLES START ---

// Collision detection threshold: How much overlap is allowed before a "collision" is registered.
// A higher value (closer to 1.0) means more overlap is allowed before a re-roll.
// If 1.0, circles can touch exactly. If > 1.0, they can visually overlap by that factor.
const COLLISION_OVERLAP_FACTOR = 0.9;
const COLLISION_PIXEL_BUFFER = -40;

// Specific stricter buffer for Spine-Torso collision
const SPINE_TORSO_COLLISION_BUFFER = -20; // Slightly stricter than general buffer

// Offset variables for body parts (adjust these to fine-tune positions)
let pelvisOffsetX = 0;
let pelvisOffsetY = 0;
let spineOffsetX = 0;
let spineOffsetY = 0;
let torsoOffsetX = 0;
let torsoOffsetY = 0;
let skullOffsetX = 0;
let skullOffsetY = -150;
let jawOffsetX = 0;
let jawOffsetY = -150;
let markOffsetX = 0;
let markOffsetY = -150; // Base offset for marks
let noseOffsetX = 0;
let noseOffsetY = -150;
let eyeOffsetX = 0;
let eyeOffsetY = -150;
let pupilOffsetX = 0;
let pupilOffsetY = -150;

// Blade offset and size adjustment variables
let bladeFrontOffsetX = 0;
let bladeFrontOffsetY = 20;
let bladeFrontScaleX = 1.1;
let bladeFrontScaleY = 1.1;
let bladeBackOffsetX = 0;
let bladeBackOffsetY = 20;
let bladeBackScaleX = 0.9;
let bladeBackScaleY = 0.9;

// Arm offsets
let armFrontOffsetX = -10; // Renamed and adjusted as needed
let armFrontOffsetY = 30; // Renamed and adjusted as needed
let armBackOffsetX = -130; // Adjust as needed
let armBackOffsetY = 30; // Adjust as needed

// Base offsets for legs (these will be adjusted by size)
let baseLegBackOffsetX = 50;
let baseLegBackOffsetY = 50;
let baseLegFrontOffsetX = -30;
let baseLegFrontOffsetY = 50;

// Base distances for blades (different for front and back)
let bladeFrontDist = 100; // Initial distance for the front blade
let bladeBackDist = 70; // Initial distance for the back blade
let bladeFrontSideOffset = -1; // -1 for left side
let bladeBackSideOffset = 1; // +1 for right side

// NEW: Blade X-axis position compensation for torso scaling (manual fine-tune)
let bladeXCompensationFactor = 0.4; // Adjust this value to control compensation strength

// Torso collision circle adjustment
let torsoCollisionOffsetYLarge = 20; // Adjust this to lower the collision circle for large torsos

// Define size-specific adjustments for leg placement (fine-tune these)
const legSizeAdjustments = {
  "small": { backX: -50, backY: 0, frontX: 30, frontY: 0 },
  "medium": { backX: -30, backY: 0, frontX: 10, frontY: 0 },
  "large": { backX: -10, backY: 10, frontX: -20, frontY: 10 }
};

// Define size-specific adjustments for blade placement (fine-tune these)
const bladeSizeAdjustments = {
  "small": { distFactor: 0.8 }, // Closer
  "medium": { distFactor: 1.4 }, // Default
  "large": { distFactor: 2 } // Further
};

// Define size-specific adjustments for mark placement on skulls (fine-tune these)
const markHeightAdjustments = {
  "small": 0, // No extra adjustment for small
  "medium": -25, // A little higher for medium
  "large": -45 // Even higher for large
};

// Y-offset compensation for character based on leg size (fine-tune these)
const characterYOffsetByLegSize = {
  "small": 260, // Lower by 150 pixels for small legs
  "medium": 120, // Lower by 100 pixels for medium legs
  "large": 0 // No extra offset for large legs
};

// Factor to adjust how much legs compensate for pelvis X-axis scaling
const PELVIS_LEG_X_COMPENSATION_FACTOR = -0.2;

// Factor to adjust how much pelvis Y-axis compensates for X-axis scaling
const PELVIS_Y_COMPENSATION_FACTOR = -0.1;

// --- JUNO RECIPE TUNEABLE VARIABLES END ---


// Current size of selected torso/pelvis
let currentPelvisSize = "medium"; // Default
let currentTorsoSize = "medium"; // Default
let currentSkullSize = "medium"; // NEW: Default skull size

let headRotationAngle = 0; // Declare global variable for head rotation

// --- UX CONTROL & REPRODUCIBILITY ---
// Composition state and controls
let currentState = null; // Holds the last generated composition parameters
let randomizeButton, exportPngButton, exportSettingsButton;
let seedInput, useSeedButton; // Seed controls
let lastUsedSeed = null;
let autoGeneratedOnce = false; // After assets load, auto-generate a first composition
let seedLocked = false; // If true, Randomize reuses the chosen seed

// Global variables for bezier length range
let bezierLengthMin;
let bezierLengthMax;

// NEW: Global variable for overall scale slider
let overallScaleMinLabel, overallScaleMaxLabel, overallScaleMinSlider, overallScaleMaxSlider;
let currentOverallScale; // To store the randomized overall scale

// Declare variables to store randomized values for display in info panel
let headXOffset;
let terminalPointXOffset;
let headRandomScaleFactor; // Declare global for head random scale factor
let pelvisRandomScaleFactor; // NEW: Declare global for pelvis random scale factor
let torsoRandomScaleFactor; // NEW: Declare global for torso random scale factor

// NEW: Global variable for show/hide debug elements
let showDebugElementsCheckbox;

// Global variables for sliders and their labels
let initialAngleMinLabel, initialAngleMaxLabel, initialAngleMinSlider, initialAngleMaxSlider;
let initialIntensityMinLabel, initialIntensityMaxLabel, initialIntensityMinSlider, initialIntensityMaxSlider;
let terminalAngleMinLabel, terminalAngleMaxLabel, terminalAngleMinSlider, terminalAngleMaxSlider;
let terminalIntensityMinLabel, terminalIntensityMaxLabel, terminalIntensityMinSlider, terminalIntensityMaxSlider;
let verticalDispMinLabel, verticalDispMaxLabel, verticalDispMinSlider, verticalDispMaxSlider;
let point1PosMinLabel, point1PosMaxLabel, point1PosMinSlider, point1PosMaxSlider; // UPDATED to min/max sliders
let point2PosMinLabel, point2PosMaxLabel, point2PosMinSlider, point2PosMaxSlider; // UPDATED to min/max sliders
let terminalPointXMinLabel, terminalPointXMaxLabel, terminalPointXMinSlider, terminalPointXMaxSlider;
let headXOffsetMinLabel, headXOffsetMaxLabel, headXOffsetMinSlider, headXOffsetMaxSlider;
let overallScaleLabel;
let collisionDetectionCheckbox;
// NEW: Global variables for green hue sliders
let greenHueMinLabel, greenHueMaxLabel, greenHueMinSlider, greenHueMaxSlider;
// NEW: Global variables for green saturation sliders
let greenSaturationMinLabel, greenSaturationMaxLabel, greenSaturationMinSlider, greenSaturationMaxSlider;
// NEW: Global variables for green brightness sliders
let greenBrightnessMinLabel, greenBrightnessMaxLabel, greenBrightnessMinSlider, greenBrightnessMaxSlider;
// NEW: Global variables for general brightness sliders
let generalBrightnessMinLabel, generalBrightnessMaxLabel, generalBrightnessMinSlider, generalBrightnessMaxSlider;

// Global variables for curve points and image references
let currentSpineImage, currentBladeFrontImage, currentBladeBackImage, currentArmFrontIdleImage, currentArmBackImage;
let currentLegBackImage, currentLegFrontImage;
let currentPelvisImage, currentTorsoImage, currentSkullImage, currentJawImage, currentMarkImage, currentNoseImage, currentEyeImage, currentPupilImage;
let initialAngle, initialIntensity, terminalAngle, terminalIntensity, randomVerticalLength;
let tPoint1, tPoint2;
let x1, y1, x2, y2, cx1, cy1, cx2, cy2;
let p1x, p1y, pPoint1X, pPoint1Y, pPoint2X, pPoint2Y, p2x, p2y;

// NEW: Global variable for the current random green hue, saturation, and brightness
let currentSkeletonGreenHue;
let currentSkeletonGreenSaturation;
let currentSkeletonGreenBrightness;
// NEW: Global variable for the current random general brightness
let currentSkeletonGeneralBrightness;

// Cache for recolored images to avoid repeated processing
const recoloredImageCache = new WeakMap();
const selectiveTintArrayNames = new Set([
  'jaws',
  'armsBack',
  'armsBack_1h',
  'armsBack_hello',
  'armsFront_idle',
  'armsFront_express',
  'armsFront_interact',
  'armsFront_phone'
]);
const selectiveTintKeys = new Set(['jaw', 'armBack', 'armFrontIdle']);
const tintExemptKeys = new Set(['pupil']);
const COLOR_QUANTIZATION_STEPS = {
  hue: 4, // degrees
  saturation: 5, // percent
  brightness: 5, // percent
  generalBrightness: 5 // percent
};

// List of categories *used* in this specific scene (matched to JSON keys)
const USED_CATEGORIES = [
  'pelvis_small', 'pelvis_medium', 'pelvis_large',
  'spines',
  'torso_small', 'torso_medium', 'torso_large',
  'skulls_small', 'skulls_medium', 'skulls_large',
  'jaws', 'marks', 'noses', 'eyes', 'pupils',
  'legsBack_small', 'legsBack_medium', 'legsBack_large',
  'legsFront_small', 'legsFront_medium', 'legsFront_large',
  'blades',
  'armsBack', 'armsBack_1h', 'armsFront_idle', 'armsFront_express',
  'armsFront_interact', 'armsFront_phone', 'armsBack_hello'
];

// Helper function to map category names to their target array references
function getTargetArray(category) {
  switch (category) {
    case 'pelvis_small':
      return imgPelvisSmall;
    case 'pelvis_medium':
      return imgPelvisMedium;
    case 'pelvis_large':
      return imgPelvisLarge;
    case 'spines':
      return imgSpine;
    case 'torso_small':
      return imgTorsoSmall;
    case 'torso_medium':
      return imgTorsoMedium;
    case 'torso_large':
      return imgTorsoLarge;
    case 'skulls_small':
      return imgSkullsSmall;
    case 'skulls_medium':
      return imgSkullsMedium;
    case 'skulls_large':
      return imgSkullsLarge;
    case 'jaws':
      return imgJaws;
    case 'marks':
      return imgMarks;
    case 'noses':
      return imgNoses;
    case 'eyes':
      return imgEyes;
    case 'pupils':
      return imgPupils;
    case 'legsBack_small':
      return imgLegsBackSmall;
    case 'legsBack_medium':
      return imgLegsBackMedium;
    case 'legsBack_large':
      return imgLegsBackLarge;
    case 'legsFront_small':
      return imgLegsFrontSmall;
    case 'legsFront_medium':
      return imgLegsFrontMedium;
    case 'legsFront_large':
      return imgLegsFrontLarge;
    case 'blades':
      return imgBlades;
    case 'armsBack':
      return imgArmsBack;
    case 'armsBack_1h':
      return imgArmsBack_1h;
    case 'armsFront_idle':
      return imgArmsFrontIdle;
    case 'armsFront_express':
      return imgArmsFrontExpress;
    case 'armsFront_interact':
      return imgArmsFrontInteract;
    case 'armsFront_phone':
      return imgArmsFrontPhone;
    case 'armsBack_hello':
      return imgArmsBackHello;
    default:
      return null;
  }
}

function preload() {
  // Load the external JSON asset library file synchronously
  assetLibraryData = loadJSON('https://raw.githubusercontent.com/skeenee/skullito-assets/refs/heads/main/SKULLITOS_assetLibrary.json', () => {
    console.log("Asset library loaded successfully.");

    // Calculate total assets to load, ONLY for the USED_CATEGORIES
    totalAssetsToLoad = 0;
    USED_CATEGORIES.forEach(category => {
      const urls = assetLibraryData[category];
      if (Array.isArray(urls)) {
        totalAssetsToLoad += urls.length;
      }
    });

  }, (e) => {
    console.error("Failed to load asset library JSON:", e);
    // Setting totalAssetsToLoad to a non-zero value here will force the loading screen to show an error
    totalAssetsToLoad = -1; // Indicate a JSON loading failure
  });
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  // detect touch-capable devices once
  window.isMobile = (('ontouchstart' in window) || navigator.maxTouchPoints > 0) && width < 767;
  cnv.elt.style.touchAction = "none";
  cnv.elt.addEventListener('touchmove', e => {
    e.preventDefault();
  }, { passive: false });
  frameRate(24);

  // Set color mode to HSB for easier green manipulation
  colorMode(HSB, 360, 100, 100, 255);

  // --- ASYNCHRONOUS IMAGE LOADING START ---
  // Wait for the JSON to be loaded (which happens in preload)
  if (assetLibraryData && totalAssetsToLoad > 0) {
    // Iterate ONLY over the USED_CATEGORIES to load assets
    USED_CATEGORIES.forEach(category => {
      const urls = assetLibraryData[category];
      if (!Array.isArray(urls)) return;
      
      const targetArray = getTargetArray(category);
      if (!targetArray || targetArray.__loadingInitialized) return;

      // Preallocate to preserve ordering regardless of async completion sequence
      targetArray.length = urls.length;
      targetArray.__loadingInitialized = true;

      urls.forEach((url, index) => loadImage(url,
        img => {
          targetArray[index] = img;
          assetsLoadedCount++;
          if (assetsLoadedCount === totalAssetsToLoad) {
            assetsLoadingComplete = true;
          }
        },
        e => {
          console.error(`Failed to load image from ${url} in category ${category}:`, e);
          targetArray[index] = null;
          assetsLoadedCount++;
          if (assetsLoadedCount === totalAssetsToLoad) {
            assetsLoadingComplete = true;
          }
        }
      ));
    });
  }
  // --- ASYNCHRONOUS IMAGE LOADING END ---

  // Create a container for all UI elements to manage their position easily
  uiContainer = createDiv('');
  uiContainer.position(10, 10);
  uiContainer.style('color', 'white');
  uiContainer.style('font-family', 'monospace');
  uiContainer.style('font-size', '14px');
  uiContainer.style('padding', '10px');
  uiContainer.style('background-color', 'rgba(0,0,0,0.5)');
  uiContainer.style('border-radius', '5px');
  uiContainer.style('width', '520px'); // Increased width for two columns
  uiContainer.style('display', 'flex'); // Use flexbox for easier column management
  uiContainer.style('flex-wrap', 'wrap'); // Allow items to wrap if needed
  uiContainer.style('align-items', 'flex-start'); // Align items to the top

  // Create two columns inside the main UI container
  let uiColumn1 = createDiv('');
  uiColumn1.parent(uiContainer);
  uiColumn1.style('width', '250px');
  uiColumn1.style('padding-right', '10px'); // Add some padding between columns
  uiColumn1.style('box-sizing', 'border-box'); // Include padding in width calculation
  uiColumn1.style('display', 'flex'); // Make column 1 a flex container
  uiColumn1.style('flex-direction', 'column'); // Stack items vertically

  let uiColumn2 = createDiv('');
  uiColumn2.parent(uiContainer);
  uiColumn2.style('width', '250px');
  uiColumn2.style('padding-left', '10px'); // Add some padding between columns
  uiColumn2.style('box-sizing', 'border-box'); // Include padding in width calculation
  uiColumn2.style('display', 'flex'); // Make column 2 a flex container
  uiColumn2.style('flex-direction', 'column'); // Stack items vertically
  
  // --- Controls Row (Generate / Seed / Export) ---
  const controlsGroup = createDiv('');
  controlsGroup.parent(uiColumn2);
  controlsGroup.style('margin-bottom', '20px');

  const controlsTitle = createDiv('Controls:');
  controlsTitle.parent(controlsGroup);
  controlsTitle.style('margin-bottom', '6px');

  // Seed input + apply button
  let seedRow = createDiv('');
  seedRow.parent(controlsGroup);
  seedRow.style('display', 'flex');
  seedRow.style('gap', '6px');
  seedRow.style('align-items', 'center');

  seedInput = createInput('');
  seedInput.parent(seedRow);
  seedInput.attribute('placeholder', 'Seed (number)');
  seedInput.style('width', '100px');

  useSeedButton = createButton('Use Seed');
  useSeedButton.parent(seedRow);
  useSeedButton.mousePressed(() => {
    const val = seedInput.value().trim();
    if (val !== '' && !isNaN(Number(val))) {
      lastUsedSeed = Number(val);
      seedLocked = true;
      // Do not generate automatically; wait for Generate pressed
      console.log('Seed set to', lastUsedSeed);
    }
  });

  // Generate button
  randomizeButton = createButton('Generate');
  randomizeButton.parent(controlsGroup);
  randomizeButton.style('margin-top', '6px');
  randomizeButton.mousePressed(() => {
    if (!assetsLoadingComplete) return;
    const currentSeedText = seedInput.value ? seedInput.value().trim() : '';
    if (seedLocked && currentSeedText === '') {
      seedLocked = false;
      lastUsedSeed = null;
    }
    // If no locked seed, create a fresh seed for each Generate click
    if (!seedLocked) {
      lastUsedSeed = floor(random(1e9));
    }
    generateComposition();
  });

  // Export buttons
  let exportRow = createDiv('');
  exportRow.parent(controlsGroup);
  exportRow.style('display', 'flex');
  exportRow.style('gap', '6px');
  exportRow.style('margin-top', '6px');

  exportPngButton = createButton('Export PNG');
  exportPngButton.parent(exportRow);
  exportPngButton.mousePressed(() => {
    if (!currentState) return;
    const ts = Date.now();
    saveCanvas('skullitos_' + ts, 'png');
  });

  exportSettingsButton = createButton('Export Settings');
  exportSettingsButton.parent(exportRow);
  exportSettingsButton.mousePressed(() => {
    if (!currentState) return;
    const ts = Date.now();
    saveJSON(currentStateToExportJSON(), 'skullitos_settings_' + ts + '.json');
  });

  let sliderWidth = 150;
  let labelWidth = 50;
  let groupGap = 20;

  // Helper to create a labeled slider pair, now accepting a parent div
  function createRangeSliders(groupName, minRange, maxRange, defaultMin, defaultMax, step, parentDiv, unit = '') {
    let groupDiv = createDiv('');
    groupDiv.parent(parentDiv);
    groupDiv.style('margin-bottom', groupGap + 'px');

    let title = createDiv(groupName);
    title.parent(groupDiv);
    title.style('margin-bottom', '5px');

    let minSliderContainer = createDiv('');
    minSliderContainer.parent(groupDiv);
    minSliderContainer.style('display', 'flex');
    minSliderContainer.style('align-items', 'center');
    minSliderContainer.style('margin-bottom', '5px');

    let minSlider = createSlider(minRange, maxRange, defaultMin, step);
    minSlider.parent(minSliderContainer);
    minSlider.style('width', sliderWidth + 'px');
    minSlider.style('margin-right', '10px');

    let minLabel = createDiv(`Min: ${defaultMin}${unit}`);
    minLabel.parent(minSliderContainer);
    minLabel.style('width', labelWidth + 'px');

    let maxSliderContainer = createDiv('');
    maxSliderContainer.parent(groupDiv);
    maxSliderContainer.style('display', 'flex');
    maxSliderContainer.style('align-items', 'center');
    maxSliderContainer.style('margin-bottom', '5px');

    let maxSlider = createSlider(minRange, maxRange, defaultMax, step);
    maxSlider.parent(maxSliderContainer);
    maxSlider.style('width', sliderWidth + 'px');
    maxSlider.style('margin-right', '10px');

    let maxLabel = createDiv(`Max: ${defaultMax}${unit}`);
    maxLabel.parent(maxSliderContainer);
    maxLabel.style('width', labelWidth + 'px');

    return { minLabel, maxLabel, minSlider, maxSlider };
  }

  // Helper to create a single labeled slider, now accepting a parent div
  function createSingleSlider(groupName, minRange, maxRange, defaultValue, step, parentDiv, unit = '') {
    let groupDiv = createDiv('');
    groupDiv.parent(parentDiv);
    groupDiv.style('margin-bottom', groupGap + 'px');

    let title = createDiv(groupName);
    title.parent(groupDiv);
    title.style('margin-bottom', '5px');

    let sliderContainer = createDiv('');
    sliderContainer.parent(groupDiv);
    sliderContainer.style('display', 'flex');
    sliderContainer.style('align-items', 'center');
    sliderContainer.style('margin-bottom', '5px');

    let singleSlider = createSlider(minRange, maxRange, defaultValue, step);
    singleSlider.parent(sliderContainer);
    singleSlider.style('width', sliderWidth + 'px');
    singleSlider.style('margin-right', '10px');

    let valueLabel = createDiv(`Value: ${defaultValue}${unit}`);
    valueLabel.parent(sliderContainer);
    valueLabel.style('width', labelWidth + 'px');

    return { valueLabel, singleSlider };
  }

  // COLUMN 1 SLIDERS

  // Initial Angle Range
  let iaResults = createRangeSliders('Initial Angle Range:', 250, 280, 250, 280, 1, uiColumn1, '°');
  initialAngleMinLabel = iaResults.minLabel;
  initialAngleMaxLabel = iaResults.maxLabel;
  initialAngleMinSlider = iaResults.minSlider;
  initialAngleMaxSlider = iaResults.maxSlider;

  // Initial Intensity Range
  let iiResults = createRangeSliders('Initial Intensity Range:', 0, 180, 0, 180, 1, uiColumn1);
  initialIntensityMinLabel = iiResults.minLabel;
  initialIntensityMaxLabel = iiResults.maxLabel;
  initialIntensityMinSlider = iiResults.minSlider;
  initialIntensityMaxSlider = iiResults.maxSlider;

  // Terminal Angle Range
  let taResults = createRangeSliders('Terminal Angle Range:', 200, 300, 200, 300, 1, uiColumn1, '°');
  terminalAngleMinLabel = taResults.minLabel;
  terminalAngleMaxLabel = taResults.maxLabel;
  terminalAngleMinSlider = taResults.minSlider;
  terminalAngleMaxSlider = taResults.maxSlider;

  // Terminal Intensity Range
  let tiResults = createRangeSliders('Terminal Intensity Range:', 0, 180, 0, 180, 1, uiColumn1);
  terminalIntensityMinLabel = tiResults.minLabel;
  terminalIntensityMaxLabel = tiResults.maxLabel;
  terminalIntensityMinSlider = tiResults.minSlider;
  terminalIntensityMaxSlider = tiResults.maxSlider;

  // Bezier Vertical Displacement Range
  let blResults = createRangeSliders('Bezier Vertical Displacement Range:', 290, 500, 380, 500, 1, uiColumn1);
  verticalDispMinLabel = blResults.minLabel;
  verticalDispMaxLabel = blResults.maxLabel;
  verticalDispMinSlider = blResults.minSlider;
  verticalDispMaxSlider = blResults.maxSlider;
  // Initialize bezierLengthMin and Max
  bezierLengthMin = verticalDispMinSlider.value();
  bezierLengthMax = verticalDispMaxSlider.value();

  // Green Brightness Range (now a range slider and in COLUMN 1)
  let gbResults = createRangeSliders('Skeleton Green Brightness:', 0, 100, 60, 100, 1, uiColumn1, '%'); // Default green brightness range
  greenBrightnessMinLabel = gbResults.minLabel;
  greenBrightnessMaxLabel = gbResults.maxLabel;
  greenBrightnessMinSlider = gbResults.minSlider;
  greenBrightnessMaxSlider = gbResults.maxSlider;

  // NEW: General Brightness Range (now a range slider and in COLUMN 1)
  let genBResults = createRangeSliders('Skeleton General Brightness:', 0, 100, 80, 100, 1, uiColumn1, '%'); // Default general brightness range
  generalBrightnessMinLabel = genBResults.minLabel;
  generalBrightnessMaxLabel = genBResults.maxLabel;
  generalBrightnessMinSlider = genBResults.minSlider;
  generalBrightnessMaxSlider = genBResults.maxSlider;

  // COLUMN 2 SLIDERS

  // Point 1 Position (t-value) Range (UPDATED TO RANGE SLIDER)
  let p1Results = createRangeSliders('Point 1 Position (t-value) Range:', 0.10, 0.40, 0.22, 0.27, 0.01, uiColumn2);
  point1PosMinLabel = p1Results.minLabel;
  point1PosMaxLabel = p1Results.maxLabel;
  point1PosMinSlider = p1Results.minSlider;
  point1PosMaxSlider = p1Results.maxSlider;

  // Point 2 Position (t-value) Range (UPDATED TO RANGE SLIDER)
  let p2Results = createRangeSliders('Point 2 Position (t-value) Range:', 0.50, 0.80, 0.55, 0.80, 0.01, uiColumn2);
  point2PosMinLabel = p2Results.minLabel;
  point2PosMaxLabel = p2Results.maxLabel;
  point2PosMinSlider = p2Results.minSlider;
  point2PosMaxSlider = p2Results.maxSlider;

  // Terminal Point X Position (now a range slider)
  let tpXResults = createRangeSliders('Terminal Point X Position:', -200, 250, -200, 250, 1, uiColumn2);
  terminalPointXMinLabel = tpXResults.minLabel;
  terminalPointXMaxLabel = tpXResults.maxLabel;
  terminalPointXMinSlider = tpXResults.minSlider;
  terminalPointXMaxSlider = tpXResults.maxSlider;

  // Head Elements X Offset (now a range slider)
  let hxoResults = createRangeSliders('Head Elements X Offset:', 50, 150, 50, 150, 1, uiColumn2);
  headXOffsetMinLabel = hxoResults.minLabel;
  headXOffsetMaxLabel = hxoResults.maxLabel;
  headXOffsetMinSlider = hxoResults.minSlider;
  headXOffsetMaxSlider = hxoResults.maxSlider;

  // Overall Skeleton Scale Slider (now a range slider)
  let osResults = createRangeSliders('Overall Skeleton Scale:', 0.1, 3.0, 0.3, 0.7, 0.01, uiColumn2);
  overallScaleMinLabel = osResults.minLabel;
  overallScaleMaxLabel = osResults.maxLabel;
  overallScaleMinSlider = osResults.minSlider;
  overallScaleMaxSlider = osResults.maxSlider;

  // Green Hue Range (now a range slider)
  let ghResults = createRangeSliders('Skeleton Green Hue:', 0, 360, 60, 140, 1, uiColumn2, '°'); // Default green hue range
  greenHueMinLabel = ghResults.minLabel;
  greenHueMaxLabel = ghResults.maxLabel;
  greenHueMinSlider = ghResults.minSlider;
  greenHueMaxSlider = ghResults.maxSlider;

  // Green Saturation Range (now a range slider)
  let gsResults = createRangeSliders('Skeleton Green Saturation:', 0, 100, 30, 80, 1, uiColumn2, '%'); // Default green saturation range
  greenSaturationMinLabel = gsResults.minLabel;
  greenSaturationMaxLabel = gsResults.maxLabel;
  greenSaturationMinSlider = gsResults.minSlider;
  greenSaturationMaxSlider = gsResults.maxSlider;

  // Collision Detection Toggle
  let collisionToggleDiv = createDiv('');
  collisionToggleDiv.parent(uiColumn2);
  collisionToggleDiv.style('margin-bottom', groupGap + 'px');

  let collisionTitle = createDiv('Collision Detection:');
  collisionTitle.parent(collisionToggleDiv);
  collisionTitle.style('margin-bottom', '5px');

  collisionDetectionCheckbox = createCheckbox('', false);
  collisionDetectionCheckbox.parent(collisionToggleDiv);
  collisionDetectionCheckbox.style('display', 'inline-block');

  // NEW: Show Debug Elements Toggle
  let showDebugToggleDiv = createDiv('');
  showDebugToggleDiv.parent(uiColumn2);
  showDebugToggleDiv.style('margin-bottom', groupGap + 'px');

  let debugTitle = createDiv('Show Debug Elements:');
  debugTitle.parent(showDebugToggleDiv);
  debugTitle.style('margin-bottom', '5px');

  showDebugElementsCheckbox = createCheckbox('', false);
  showDebugElementsCheckbox.parent(showDebugToggleDiv);
  showDebugElementsCheckbox.style('display', 'inline-block');

  // --- Create info panel on the right side ---
  infoPanel = createDiv('');
  infoPanel.style('color', 'white');
  infoPanel.style('font-family', 'monospace');
  infoPanel.style('font-size', '14px');
  infoPanel.style('padding', '10px');
  infoPanel.style('background-color', 'rgba(0,0,0,0.5)');
  infoPanel.style('border-radius', '5px');
  infoPanel.style('width', '250px');

  // Position it on the right side, with some margin
  infoPanel.position(width - 270, 10);

  // Create sub-divs for each section inside the infoPanel
  currentRandomizedValuesDiv = createDiv('');
  currentRandomizedValuesDiv.parent(infoPanel);
  currentRandomizedValuesDiv.style('margin-bottom', '20px');

  curvePointCoordinatesDiv = createDiv('');
  curvePointCoordinatesDiv.parent(infoPanel);
}

function rgbToHsb(r, g, b) {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;

  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rr) {
      h = ((gg - bb) / delta) % 6;
    } else if (max === gg) {
      h = (bb - rr) / delta + 2;
    } else {
      h = (rr - gg) / delta + 4;
    }
    h *= 60;
    if (h < 0) {
      h += 360;
    }
  }

  const s = max === 0 ? 0 : delta / max;
  const v = max;

  return {
    h,
    s: s * 100,
    b: v * 100
  };
}

function hsbToRgb(h, s, b) {
  const wrappedHue = ((h % 360) + 360) % 360;
  const ss = constrain(s, 0, 100) / 100;
  const vv = constrain(b, 0, 100) / 100;

  const c = vv * ss;
  const hh = wrappedHue / 60;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = vv - c;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hh >= 0 && hh < 1) {
    r1 = c;
    g1 = x;
  } else if (hh >= 1 && hh < 2) {
    r1 = x;
    g1 = c;
  } else if (hh >= 2 && hh < 3) {
    g1 = c;
    b1 = x;
  } else if (hh >= 3 && hh < 4) {
    g1 = x;
    b1 = c;
  } else if (hh >= 4 && hh < 5) {
    r1 = x;
    b1 = c;
  } else {
    r1 = c;
    b1 = x;
  }

  return {
    r: Math.round(constrain((r1 + m) * 255, 0, 255)),
    g: Math.round(constrain((g1 + m) * 255, 0, 255)),
    b: Math.round(constrain((b1 + m) * 255, 0, 255))
  };
}

function quantizeInRange(value, step, min, max) {
  if (!step || step <= 0) {
    return Math.min(max, Math.max(min, value));
  }
  const quantized = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, quantized));
}

function processUniformSkeletonImage(img, newHue, newSaturation, newBrightness, generalBrightness) {
  if (!img) return null;

  let imageCache = recoloredImageCache.get(img);
  if (!imageCache) {
    imageCache = new Map();
    recoloredImageCache.set(img, imageCache);
  }

  const cacheKey = `uniform_${newHue.toFixed(4)}_${newSaturation.toFixed(4)}_${newBrightness.toFixed(4)}_${generalBrightness.toFixed(4)}`;
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  let pg = createGraphics(img.width, img.height);
  pg.image(img, 0, 0);
  pg.loadPixels();

  const generalBrightnessFactor = Math.max(0, Math.min(1, generalBrightness / 100));
  const applyGeneralBrightness = generalBrightnessFactor !== 1;
  const pixels = pg.pixels;

  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a === 0) continue;

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const originalHsb = rgbToHsb(r, g, b);
    let finalBrightness = newBrightness * (originalHsb.b / 100);
    if (applyGeneralBrightness) {
      finalBrightness *= generalBrightnessFactor;
    }
    finalBrightness = constrain(finalBrightness, 0, 100);

    const tintedRgb = hsbToRgb(newHue, newSaturation, finalBrightness);
    pixels[i] = tintedRgb.r;
    pixels[i + 1] = tintedRgb.g;
    pixels[i + 2] = tintedRgb.b;
    pixels[i + 3] = a;
  }

  pg.updatePixels();
  imageCache.set(cacheKey, pg);
  return pg;
}

// Function to recolor green parts of an image and apply general brightness
function processSkeletonImage(img, newGreenHue, newGreenSaturation, newGreenBrightness, generalBrightness) {
  if (!img) return null; // Return null if image is not loaded

  // Obtain or create the per-image cache map
  let imageCache = recoloredImageCache.get(img);
  if (!imageCache) {
    imageCache = new Map();
    recoloredImageCache.set(img, imageCache);
  }

  // Use coloration parameters as cache key; stringify with limited precision to avoid tiny float diffs
  const cacheKey = `${newGreenHue.toFixed(4)}_${newGreenSaturation.toFixed(4)}_${newGreenBrightness.toFixed(4)}_${generalBrightness.toFixed(4)}`;

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  // Create a graphics buffer to draw the image and manipulate pixels
  let pg = createGraphics(img.width, img.height);
  pg.image(img, 0, 0);
  pg.loadPixels();

  // Define the green hue range (e.g., 60 to 180 degrees in HSB)
  const minGreenHue = 60;
  const maxGreenHue = 180;
  const minSaturationThreshold = 10; // Minimum saturation for a pixel to be considered "green"
  const minOriginalBrightness = 5; // Minimum brightness for a pixel to be considered "green"
  const maxOriginalBrightness = 95; // Maximum brightness for a pixel to be considered "green"
  const generalBrightnessFactor = Math.max(0, Math.min(1, generalBrightness / 100));
  const applyGeneralBrightness = generalBrightnessFactor !== 1;
  const pixels = pg.pixels;

  for (let i = 0; i < pixels.length; i += 4) {
    const a = pixels[i + 3];
    if (a === 0) continue; // Skip transparent pixels

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const originalHsb = rgbToHsb(r, g, b);
    let finalHue = originalHsb.h;
    let finalSaturation = originalHsb.s;
    let finalBrightness = originalHsb.b;

    const isGreen =
      originalHsb.h >= minGreenHue &&
      originalHsb.h <= maxGreenHue &&
      originalHsb.s > minSaturationThreshold &&
      originalHsb.b > minOriginalBrightness &&
      originalHsb.b < maxOriginalBrightness;

    if (isGreen) {
      finalHue = newGreenHue;
      finalSaturation = newGreenSaturation;
      const relativeBrightnessFactor = originalHsb.b / 100;
      finalBrightness = newGreenBrightness * relativeBrightnessFactor;
    }

    if (applyGeneralBrightness) {
      finalBrightness *= generalBrightnessFactor;
    }

    finalBrightness = constrain(finalBrightness, 0, 100);
    finalSaturation = constrain(finalSaturation, 0, 100);

    const newColor = hsbToRgb(finalHue, finalSaturation, finalBrightness);
    pixels[i] = newColor.r;
    pixels[i + 1] = newColor.g;
    pixels[i + 2] = newColor.b;
    pixels[i + 3] = a;
  }
  pg.updatePixels();

  // Store the newly created graphics buffer in the cache
  imageCache.set(cacheKey, pg);
  return pg; // Return the graphics buffer as a p5.Image object
}

// Array to hold the images for the current skeleton after recoloring
let currentSkeletonImages = {};

// Convert currentState into a minimal export JSON
function currentStateToExportJSON() {
  if (!currentState) return {};
  // Exclude heavy image buffers; include parameters only
  const {
    seed,
    initialAngle, initialIntensity, terminalAngle, terminalIntensity,
    bezierLengthMin, bezierLengthMax,
    randomVerticalLength,
    tPoint1, tPoint2,
    terminalPointXOffset, headXOffset,
    headRandomScaleFactor, pelvisRandomScaleFactor, torsoRandomScaleFactor,
    headRotationAngle,
    currentPelvisSize, currentTorsoSize, currentSkullSize,
    currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness,
    currentSkeletonGeneralBrightness,
    currentOverallScale,
    bladeRandomRotation,
    pupilJitterX, pupilJitterY,
    assetSelections
  } = currentState;
  return {
    seed,
    initialAngle, initialIntensity, terminalAngle, terminalIntensity,
    bezierLengthMin, bezierLengthMax,
    randomVerticalLength,
    tPoint1, tPoint2,
    terminalPointXOffset, headXOffset,
    headRandomScaleFactor, pelvisRandomScaleFactor, torsoRandomScaleFactor,
    headRotationAngle,
    currentPelvisSize, currentTorsoSize, currentSkullSize,
    currentSkeletonGreenHue, currentSkeletonGreenSaturation, currentSkeletonGreenBrightness,
    currentSkeletonGeneralBrightness,
    currentOverallScale,
    bladeRandomRotation,
    pupilJitterX, pupilJitterY,
    assetSelections: assetSelections ? JSON.parse(JSON.stringify(assetSelections)) : null
  };
}

function createCompositionAttempt({
  sliderRanges,
  colorRanges,
  collisionDetectionEnabled
}) {
  const {
    initialAngleMin, initialAngleMax,
    initialIntensityMin, initialIntensityMax,
    terminalAngleMin, terminalAngleMax,
    terminalIntensityMin, terminalIntensityMax,
    bezierLengthMinValue, bezierLengthMaxValue,
    point1Min, point1Max,
    point2Min, point2Max,
    terminalPointXMin, terminalPointXMax,
    headXOffsetMin, headXOffsetMax,
    overallScaleMin, overallScaleMax
  } = sliderRanges;

  const {
    greenHueMin, greenHueMax,
    greenSaturationMin, greenSaturationMax,
    greenBrightnessMin, greenBrightnessMax,
    generalBrightnessMin, generalBrightnessMax
  } = colorRanges;

  // Randomize color parameters for this attempt
  let attemptSkeletonGreenHue = random(greenHueMin, greenHueMax);
  let attemptSkeletonGreenSaturation = random(greenSaturationMin, greenSaturationMax);
  let attemptSkeletonGreenBrightness = random(greenBrightnessMin, greenBrightnessMax);
  let attemptSkeletonGeneralBrightness = random(generalBrightnessMin, generalBrightnessMax);

  attemptSkeletonGreenHue = quantizeInRange(attemptSkeletonGreenHue, COLOR_QUANTIZATION_STEPS.hue, greenHueMin, greenHueMax);
  attemptSkeletonGreenSaturation = quantizeInRange(attemptSkeletonGreenSaturation, COLOR_QUANTIZATION_STEPS.saturation, greenSaturationMin, greenSaturationMax);
  attemptSkeletonGreenBrightness = quantizeInRange(attemptSkeletonGreenBrightness, COLOR_QUANTIZATION_STEPS.brightness, greenBrightnessMin, greenBrightnessMax);
  attemptSkeletonGeneralBrightness = quantizeInRange(attemptSkeletonGeneralBrightness, COLOR_QUANTIZATION_STEPS.generalBrightness, generalBrightnessMin, generalBrightnessMax);

  // Helper to pick and tint an asset while capturing index metadata
  const attemptImages = {};
  const assetSelections = {};
  const pickTintedAsset = (key, array, arrayName) => {
    if (!array || array.length === 0) {
      assetSelections[key] = { array: arrayName ?? null, index: null };
      attemptImages[key] = null;
      return null;
    }
    const index = floor(random(array.length));
    const sourceImage = array[index];
    let tintedImage;
    if (tintExemptKeys.has(key)) {
      tintedImage = sourceImage;
    } else {
      const useSelectiveTint =
        (arrayName && selectiveTintArrayNames.has(arrayName)) ||
        selectiveTintKeys.has(key);
      tintedImage = useSelectiveTint
        ? processSkeletonImage(
            sourceImage,
            attemptSkeletonGreenHue,
            attemptSkeletonGreenSaturation,
            attemptSkeletonGreenBrightness,
            attemptSkeletonGeneralBrightness
          )
        : processUniformSkeletonImage(
            sourceImage,
            attemptSkeletonGreenHue,
            attemptSkeletonGreenSaturation,
            attemptSkeletonGreenBrightness,
            attemptSkeletonGeneralBrightness
          );
    }
    assetSelections[key] = { array: arrayName ?? null, index };
    attemptImages[key] = tintedImage;
    return tintedImage;
  };

  // Pelvis size selection drives several other choices
  const pelvisSizeChoice = floor(random(3));
  let attemptPelvisSize = "medium";
  if (pelvisSizeChoice === 0 && imgPelvisSmall.length > 0) {
    attemptPelvisSize = "small";
  } else if (pelvisSizeChoice === 2 && imgPelvisLarge.length > 0) {
    attemptPelvisSize = "large";
  }

  // Map size to asset arrays
  const pelvisArrayMap = {
    small: { array: imgPelvisSmall, name: 'pelvis_small' },
    medium: { array: imgPelvisMedium, name: 'pelvis_medium' },
    large: { array: imgPelvisLarge, name: 'pelvis_large' }
  };
  const torsoArrayMap = {
    small: { array: imgTorsoSmall, name: 'torso_small' },
    medium: { array: imgTorsoMedium, name: 'torso_medium' },
    large: { array: imgTorsoLarge, name: 'torso_large' }
  };
  const skullArrayMap = {
    small: { array: imgSkullsSmall, name: 'skulls_small' },
    medium: { array: imgSkullsMedium, name: 'skulls_medium' },
    large: { array: imgSkullsLarge, name: 'skulls_large' }
  };
  const legBackMap = {
    small: { array: imgLegsBackSmall, name: 'legsBack_small' },
    medium: { array: imgLegsBackMedium, name: 'legsBack_medium' },
    large: { array: imgLegsBackLarge, name: 'legsBack_large' }
  };
  const legFrontMap = {
    small: { array: imgLegsFrontSmall, name: 'legsFront_small' },
    medium: { array: imgLegsFrontMedium, name: 'legsFront_medium' },
    large: { array: imgLegsFrontLarge, name: 'legsFront_large' }
  };

  const pelvisInfo = pelvisArrayMap[attemptPelvisSize];
  pickTintedAsset('pelvis', pelvisInfo ? pelvisInfo.array : null, pelvisInfo ? pelvisInfo.name : null);

  // Torso size selection
  const torsoSizeChoice = floor(random(3));
  let attemptTorsoSize = "medium";
  if (torsoSizeChoice === 0 && imgTorsoSmall.length > 0) {
    attemptTorsoSize = "small";
  } else if (torsoSizeChoice === 2 && imgTorsoLarge.length > 0) {
    attemptTorsoSize = "large";
  }
  const torsoInfo = torsoArrayMap[attemptTorsoSize];
  pickTintedAsset('torso', torsoInfo ? torsoInfo.array : null, torsoInfo ? torsoInfo.name : null);

  // Skull size selection
  const skullSizeChoice = floor(random(3));
  let attemptSkullSize = "medium";
  if (skullSizeChoice === 0 && imgSkullsSmall.length > 0) {
    attemptSkullSize = "small";
  } else if (skullSizeChoice === 2 && imgSkullsLarge.length > 0) {
    attemptSkullSize = "large";
  }
  const skullInfo = skullArrayMap[attemptSkullSize];
  pickTintedAsset('skull', skullInfo ? skullInfo.array : null, skullInfo ? skullInfo.name : null);

  // Shared head elements
  pickTintedAsset('jaw', imgJaws, 'jaws');
  pickTintedAsset('nose', imgNoses, 'noses');
  pickTintedAsset('eye', imgEyes, 'eyes');
  pickTintedAsset('pupil', imgPupils, 'pupils');
  pickTintedAsset('mark', imgMarks, 'marks');

  // Spine and blades
  pickTintedAsset('spine', imgSpine, 'spines');
  pickTintedAsset('bladeFront', imgBlades, 'blades');
  pickTintedAsset('bladeBack', imgBlades, 'blades');

  // Arms – decide combo upfront
  const armCombos = [];
  if (imgArmsBack_1h.length > 0 && imgArmsFrontIdle.length > 0) armCombos.push({ back: imgArmsBack_1h, backName: 'armsBack_1h', front: imgArmsFrontIdle, frontName: 'armsFront_idle' });
  if (imgArmsBack_1h.length > 0 && imgArmsFrontExpress.length > 0) armCombos.push({ back: imgArmsBack_1h, backName: 'armsBack_1h', front: imgArmsFrontExpress, frontName: 'armsFront_express' });
  if (imgArmsBack_1h.length > 0 && imgArmsFrontInteract.length > 0) armCombos.push({ back: imgArmsBack_1h, backName: 'armsBack_1h', front: imgArmsFrontInteract, frontName: 'armsFront_interact' });
  if (imgArmsBackHello.length > 0 && imgArmsFrontPhone.length > 0) armCombos.push({ back: imgArmsBackHello, backName: 'armsBack_hello', front: imgArmsFrontPhone, frontName: 'armsFront_phone' });

  let chosenCombo = null;
  if (armCombos.length > 0) {
    chosenCombo = armCombos[floor(random(armCombos.length))];
  }
  if (chosenCombo) {
    pickTintedAsset('armBack', chosenCombo.back, chosenCombo.backName);
    pickTintedAsset('armFrontIdle', chosenCombo.front, chosenCombo.frontName);
  } else {
    assetSelections.armBack = { array: null, index: null };
    assetSelections.armFrontIdle = { array: null, index: null };
    attemptImages.armBack = null;
    attemptImages.armFrontIdle = null;
  }

  // Legs determined by pelvis size
  const legBackInfo = legBackMap[attemptPelvisSize];
  pickTintedAsset('legBack', legBackInfo ? legBackInfo.array : null, legBackInfo ? legBackInfo.name : null);
  const legFrontInfo = legFrontMap[attemptPelvisSize];
  pickTintedAsset('legFront', legFrontInfo ? legFrontInfo.array : null, legFrontInfo ? legFrontInfo.name : null);

  // Mark offset depends on skull size
  const attemptMarkOffsetY = -150 + markHeightAdjustments[attemptSkullSize];

  // Skeleton scale and bezier parameters
  const attemptOverallScale = random(overallScaleMin, overallScaleMax);
  const attemptInitialAngle = random(initialAngleMin, initialAngleMax);
  const attemptInitialIntensity = random(initialIntensityMin, initialIntensityMax);
  const attemptTerminalAngle = random(terminalAngleMin, terminalAngleMax);
  const attemptTerminalIntensity = random(terminalIntensityMin, terminalIntensityMax);
  const attemptRandomVerticalLength = random(bezierLengthMinValue, bezierLengthMaxValue);
  const attemptHeadRotationAngle = (random(-30, 30) + random(-30, 30)) / 2;
  const attemptTerminalPointXOffset = random(terminalPointXMin, terminalPointXMax);
  const attemptHeadXOffset = random(headXOffsetMin, headXOffsetMax);
  const attemptHeadRandomScaleFactor = random(0.8, 1.2);
  const attemptPelvisRandomScaleFactor = random(0.8, 1.2);
  const attemptTorsoRandomScaleFactor = random(0.8, 1.2);
  const attemptBladeRandomRotation = random(radians(-30), radians(30));
  const attemptTPoint1 = random(point1Min, point1Max);
  const attemptTPoint2 = random(point2Min, point2Max);
  const attemptPupilJitterX = random(-20, 20);
  const attemptPupilJitterY = random(-20, 20);

  // Geometry calculations
  const yOffsetForLegSize = characterYOffsetByLegSize[attemptPelvisSize];
  const x1Local = 0;
  const y1Local = ((height / 4) + yOffsetForLegSize) * attemptOverallScale;
  const padding = 50 * attemptOverallScale;
  const minCanvasY = -height / 2 + padding;
  let x2Local = attemptTerminalPointXOffset * attemptOverallScale;
  let y2Local = y1Local - (attemptRandomVerticalLength * attemptOverallScale);
  y2Local = max(y2Local, minCanvasY);
  y2Local = min(y2Local, y1Local - (50 * attemptOverallScale));

  const cx1Local = x1Local + (attemptInitialIntensity * cos(radians(attemptInitialAngle))) * attemptOverallScale;
  const cy1Local = y1Local + (attemptInitialIntensity * sin(radians(attemptInitialAngle))) * attemptOverallScale;
  const cx2Local = x2Local - (attemptTerminalIntensity * cos(radians(attemptTerminalAngle))) * attemptOverallScale;
  const cy2Local = y2Local - (attemptTerminalIntensity * sin(radians(attemptTerminalAngle))) * attemptOverallScale;

  const p1xLocal = bezierPoint(x1Local, cx1Local, cx2Local, x2Local, 0);
  const p1yLocal = bezierPoint(y1Local, cy1Local, cy2Local, y2Local, 0);
  const pPoint1XLocal = bezierPoint(x1Local, cx1Local, cx2Local, x2Local, attemptTPoint1);
  const pPoint1YLocal = bezierPoint(y1Local, cy1Local, cy2Local, y2Local, attemptTPoint1);
  const pPoint2XLocal = bezierPoint(x1Local, cx1Local, cx2Local, x2Local, attemptTPoint2);
  const pPoint2YLocal = bezierPoint(y1Local, cy1Local, cy2Local, y2Local, attemptTPoint2);
  const p2xLocal = bezierPoint(x1Local, cx1Local, cx2Local, x2Local, 1);
  const p2yLocal = bezierPoint(y1Local, cy1Local, cy2Local, y2Local, 1);

  // Collision radii
  const pelvisImage = attemptImages.pelvis;
  const spineImage = attemptImages.spine;
  const torsoImage = attemptImages.torso;
  const skullImage = attemptImages.skull;
  const bladeImage = attemptImages.bladeFront;

  const rPelvisLocal = pelvisImage ? (pelvisImage.width / 2) * attemptOverallScale * attemptPelvisRandomScaleFactor * 0.50 : 0;
  const rSpineLocal = spineImage ? (max(spineImage.width, spineImage.height) / 2) * attemptOverallScale * 0.16 : 0;
  let rTorsoLocal = torsoImage ? (max(torsoImage.width, torsoImage.height) / 2) * attemptOverallScale * attemptTorsoRandomScaleFactor * 0.60 : 0;
  if (attemptTorsoSize === "large") {
    rTorsoLocal *= 1.25;
  }
  const rSkullLocal = skullImage ? (max(skullImage.width, skullImage.height) / 2) * attemptOverallScale * attemptHeadRandomScaleFactor * 0.50 : 0;
  const rBladeLocal = bladeImage ? (max(bladeImage.width, bladeImage.height) / 2) * attemptOverallScale * 0.50 : 0;

  let collisionDetected = false;
  if (collisionDetectionEnabled) {
    if (rPelvisLocal > 0 && rSpineLocal > 0 && dist(p1xLocal, p1yLocal, pPoint1XLocal, pPoint1YLocal) < (rPelvisLocal + rSpineLocal) * COLLISION_OVERLAP_FACTOR + COLLISION_PIXEL_BUFFER) {
      collisionDetected = true;
    }
    if (!collisionDetected && rSpineLocal > 0 && rTorsoLocal > 0 && dist(pPoint1XLocal, pPoint1YLocal, pPoint2XLocal, pPoint2YLocal) < (rSpineLocal + rTorsoLocal) * COLLISION_OVERLAP_FACTOR + SPINE_TORSO_COLLISION_BUFFER) {
      collisionDetected = true;
    }
  }

  return {
    collisionDetected,
    images: attemptImages,
    state: {
      seed: lastUsedSeed,
      initialAngle: attemptInitialAngle,
      initialIntensity: attemptInitialIntensity,
      terminalAngle: attemptTerminalAngle,
      terminalIntensity: attemptTerminalIntensity,
      bezierLengthMin: bezierLengthMinValue,
      bezierLengthMax: bezierLengthMaxValue,
      randomVerticalLength: attemptRandomVerticalLength,
      tPoint1: attemptTPoint1,
      tPoint2: attemptTPoint2,
      terminalPointXOffset: attemptTerminalPointXOffset,
      headXOffset: attemptHeadXOffset,
      headRandomScaleFactor: attemptHeadRandomScaleFactor,
      pelvisRandomScaleFactor: attemptPelvisRandomScaleFactor,
      torsoRandomScaleFactor: attemptTorsoRandomScaleFactor,
      headRotationAngle: attemptHeadRotationAngle,
      currentPelvisSize: attemptPelvisSize,
      currentTorsoSize: attemptTorsoSize,
      currentSkullSize: attemptSkullSize,
      currentSkeletonGreenHue: attemptSkeletonGreenHue,
      currentSkeletonGreenSaturation: attemptSkeletonGreenSaturation,
      currentSkeletonGreenBrightness: attemptSkeletonGreenBrightness,
      currentSkeletonGeneralBrightness: attemptSkeletonGeneralBrightness,
      currentOverallScale: attemptOverallScale,
      bladeRandomRotation: attemptBladeRandomRotation,
      pupilJitterX: attemptPupilJitterX,
      pupilJitterY: attemptPupilJitterY,
      assetSelections: JSON.parse(JSON.stringify(assetSelections)),
      markOffsetY: attemptMarkOffsetY,
      geometry: {
        x1: x1Local,
        y1: y1Local,
        x2: x2Local,
        y2: y2Local,
        cx1: cx1Local,
        cy1: cy1Local,
        cx2: cx2Local,
        cy2: cy2Local,
        p1x: p1xLocal,
        p1y: p1yLocal,
        pPoint1X: pPoint1XLocal,
        pPoint1Y: pPoint1YLocal,
        pPoint2X: pPoint2XLocal,
        pPoint2Y: pPoint2YLocal,
        p2x: p2xLocal,
        p2y: p2yLocal
      },
      yOffsetForLegSize
    },
    radii: {
      rPelvis: rPelvisLocal,
      rSpine: rSpineLocal,
      rTorso: rTorsoLocal,
      rSkull: rSkullLocal,
      rBlade: rBladeLocal
    }
  };
}

// Generate a new composition and persist parameters
function generateComposition() {
  // Seed if provided
  if (lastUsedSeed != null) {
    randomSeed(lastUsedSeed);
  } else {
    // Capture an auto seed so the composition is reproducible via export
    lastUsedSeed = floor(random(1e9));
    randomSeed(lastUsedSeed);
  }

  // Read slider ranges
  let initialAngleMin = initialAngleMinSlider.value();
  let initialAngleMax = initialAngleMaxSlider.value();
  let initialIntensityMin = initialIntensityMinSlider.value();
  let initialIntensityMax = initialIntensityMaxSlider.value();
  let terminalAngleMin = terminalAngleMinSlider.value();
  let terminalAngleMax = terminalAngleMaxSlider.value();
  let terminalIntensityMin = terminalIntensityMinSlider.value();
  let terminalIntensityMax = terminalIntensityMaxSlider.value();
  bezierLengthMin = verticalDispMinSlider.value();
  bezierLengthMax = verticalDispMaxSlider.value();

  let terminalPointXMin = terminalPointXMinSlider.value();
  let terminalPointXMax = terminalPointXMaxSlider.value();
  let headXOffsetMin = headXOffsetMinSlider.value();
  let headXOffsetMax = headXOffsetMaxSlider.value();
  let greenHueMin = greenHueMinSlider.value();
  let greenHueMax = greenHueMaxSlider.value();
  let greenSaturationMin = greenSaturationMinSlider.value();
  let greenSaturationMax = greenSaturationMaxSlider.value();
  let greenBrightnessMin = greenBrightnessMinSlider.value();
  let greenBrightnessMax = greenBrightnessMaxSlider.value();
  let generalBrightnessMin = generalBrightnessMinSlider.value();
  let generalBrightnessMax = generalBrightnessMaxSlider.value();

  const sliderRanges = {
    initialAngleMin,
    initialAngleMax,
    initialIntensityMin,
    initialIntensityMax,
    terminalAngleMin,
    terminalAngleMax,
    terminalIntensityMin,
    terminalIntensityMax,
    bezierLengthMinValue: bezierLengthMin,
    bezierLengthMaxValue: bezierLengthMax,
    point1Min: point1PosMinSlider.value(),
    point1Max: point1PosMaxSlider.value(),
    point2Min: point2PosMinSlider.value(),
    point2Max: point2PosMaxSlider.value(),
    terminalPointXMin,
    terminalPointXMax,
    headXOffsetMin,
    headXOffsetMax,
    overallScaleMin: overallScaleMinSlider.value(),
    overallScaleMax: overallScaleMaxSlider.value()
  };

  const colorRanges = {
    greenHueMin,
    greenHueMax,
    greenSaturationMin,
    greenSaturationMax,
    greenBrightnessMin,
    greenBrightnessMax,
    generalBrightnessMin,
    generalBrightnessMax
  };

  const MAX_ATTEMPTS = 100;
  let attemptCounter = 0;
  let attemptResult = null;
  const collisionEnabled = collisionDetectionCheckbox ? collisionDetectionCheckbox.checked() : false;

  do {
    attemptCounter++;
    attemptResult = createCompositionAttempt({
      sliderRanges,
      colorRanges,
      collisionDetectionEnabled: collisionEnabled
    });
  } while (
    attemptResult &&
    attemptResult.collisionDetected &&
    collisionEnabled &&
    attemptCounter < MAX_ATTEMPTS
  );

  if (!attemptResult) {
    console.warn("Failed to generate composition attempt.");
    return;
  }

  if (attemptCounter >= MAX_ATTEMPTS && attemptResult.collisionDetected && collisionEnabled) {
    console.warn("Max attempts reached for collision avoidance. Some assets might be overlapping. Try adjusting slider ranges or turning off collision detection.");
  }

  currentSkeletonImages = attemptResult.images;
  currentState = attemptResult.state;
  currentState.images = currentSkeletonImages;
  currentState.radii = attemptResult.radii;
  currentState.collisionDetected = attemptResult.collisionDetected;

  // Update globals for compatibility with existing drawing logic
  ({
    initialAngle,
    initialIntensity,
    terminalAngle,
    terminalIntensity,
    bezierLengthMin,
    bezierLengthMax,
    randomVerticalLength,
    tPoint1,
    tPoint2,
    terminalPointXOffset,
    headXOffset,
    headRandomScaleFactor,
    pelvisRandomScaleFactor,
    torsoRandomScaleFactor,
    headRotationAngle,
    currentPelvisSize,
    currentTorsoSize,
    currentSkullSize,
    currentSkeletonGreenHue,
    currentSkeletonGreenSaturation,
    currentSkeletonGreenBrightness,
    currentSkeletonGeneralBrightness,
    currentOverallScale
  } = currentState);

  markOffsetY = currentState.markOffsetY;
  if (currentState.geometry) {
    ({
      x1,
      y1,
      x2,
      y2,
      cx1,
      cy1,
      cx2,
      cy2,
      p1x,
      p1y,
      pPoint1X,
      pPoint1Y,
      pPoint2X,
      pPoint2Y,
      p2x,
      p2y
    } = currentState.geometry);
  }
  const radii = currentState.radii || {};
  rPelvis = radii.rPelvis || 0;
  rSpine = radii.rSpine || 0;
  rTorso = radii.rTorso || 0;
  rSkull = radii.rSkull || 0;
  rBlade = radii.rBlade || 0;
}

function draw() {
  background(20, 20, 40);

  // --- LOADING SCREEN LOGIC ---
  if (!assetsLoadingComplete) {
    let loadingText;
    let progress = totalAssetsToLoad > 0 ? assetsLoadedCount / totalAssetsToLoad : 0;
    
    textAlign(CENTER, CENTER);
    textSize(24);

    if (totalAssetsToLoad === -1) {
        // JSON failed to load
        fill(255, 0, 0); // Red error message
        loadingText = "ERROR: Failed to load asset library JSON!";
    } else {
        // Assets are still loading
        fill(255);
        loadingText = "Loading assets...";
        
        // Draw the loading bar background
        let barWidth = width * 0.6;
        let barHeight = 20;
        let barX = width / 2 - barWidth / 2;
        let barY = height / 2 + 50;

        noStroke();
        fill(50);
        rect(barX, barY, barWidth, barHeight, 5);

        // Draw the loading bar foreground (bright green)
        fill(120, 80, 80); // HSB green
        rect(barX, barY, barWidth * progress, barHeight, 5);

        // Draw the element count text
        fill(255);
        textSize(16);
        text(`${assetsLoadedCount} / ${totalAssetsToLoad} elements loaded`, width / 2, barY + barHeight + 30);
    }
    // Disable buttons while loading
    if (randomizeButton) randomizeButton.attribute('disabled', 'true');
    if (exportPngButton) exportPngButton.attribute('disabled', 'true');
    if (exportSettingsButton) exportSettingsButton.attribute('disabled', 'true');
    
    // Draw the main loading title/error
    textSize(32);
    text(loadingText, width / 2, height / 2 - 20);

    return; // Exit draw loop until loading is complete
  }
  // --- END LOADING SCREEN LOGIC ---

  // Enable controls when ready
  if (randomizeButton) randomizeButton.removeAttribute('disabled');
  if (exportPngButton) exportPngButton.removeAttribute('disabled');
  if (exportSettingsButton) exportSettingsButton.removeAttribute('disabled');

  // Auto-generate one composition after assets load
  if (!autoGeneratedOnce && assetsLoadingComplete) {
    autoGeneratedOnce = true;
    generateComposition();
  }

  // If a composition exists, fix the random sequence to its seed to keep
  // the frame stable until the user clicks Generate again.
  if (currentState && currentState.seed != null) {
    randomSeed(currentState.seed);
  }


  // Update slider value labels
  initialAngleMinLabel.html(`Min: ${initialAngleMinSlider.value()}°`);
  initialAngleMaxLabel.html(`Max: ${initialAngleMaxSlider.value()}°`);
  initialIntensityMinLabel.html(`Min: ${initialIntensityMinSlider.value()}`);
  initialIntensityMaxLabel.html(`Max: ${initialIntensityMaxSlider.value()}`);
  terminalAngleMinLabel.html(`Min: ${terminalAngleMinSlider.value()}°`);
  terminalAngleMaxLabel.html(`Max: ${terminalAngleMaxSlider.value()}°`);
  terminalIntensityMinLabel.html(`Min: ${terminalIntensityMinSlider.value()}`);
  terminalIntensityMaxLabel.html(`Max: ${terminalIntensityMaxSlider.value()}`);
  verticalDispMinLabel.html(`Min: ${verticalDispMinSlider.value()}`);
  verticalDispMaxLabel.html(`Max: ${verticalDispMaxSlider.value()}`);
  // UPDATED: Update labels for new min/max point position sliders
  point1PosMinLabel.html(`Min: ${nfc(point1PosMinSlider.value(), 2)}`);
  point1PosMaxLabel.html(`Max: ${nfc(point1PosMaxSlider.value(), 2)}`);
  point2PosMinLabel.html(`Min: ${nfc(point2PosMinSlider.value(), 2)}`);
  point2PosMaxLabel.html(`Max: ${nfc(point2PosMaxSlider.value(), 2)}`);
  terminalPointXMinLabel.html(`Min: ${terminalPointXMinSlider.value()}`); // Update min label for new slider
  terminalPointXMaxLabel.html(`Max: ${terminalPointXMaxSlider.value()}`); // Update max label for new slider
  headXOffsetMinLabel.html(`Min: ${headXOffsetMinSlider.value()}`);
  headXOffsetMaxLabel.html(`Max: ${headXOffsetMaxSlider.value()}`);
  overallScaleMinLabel.html(`Min: ${nfc(overallScaleMinSlider.value(), 2)}x`);
  overallScaleMaxLabel.html(`Max: ${nfc(overallScaleMaxSlider.value(), 2)}x`);
  greenHueMinLabel.html(`Min: ${greenHueMinSlider.value()}°`); // NEW: Update green hue min label
  greenHueMaxLabel.html(`Max: ${greenHueMaxSlider.value()}°`); // NEW: Update green hue max label
  greenSaturationMinLabel.html(`Min: ${greenSaturationMinSlider.value()}%`); // NEW: Update green saturation min label
  greenSaturationMaxLabel.html(`Max: ${greenSaturationMaxSlider.value()}%`); // NEW: Update green saturation max label
  greenBrightnessMinLabel.html(`Min: ${greenBrightnessMinSlider.value()}%`); // NEW: Update green brightness min label
  greenBrightnessMaxLabel.html(`Max: ${greenBrightnessMaxSlider.value()}%`); // NEW: Update green brightness max label
  generalBrightnessMinLabel.html(`Min: ${generalBrightnessMinSlider.value()}%`); // NEW: Update general brightness min label
  generalBrightnessMaxLabel.html(`Max: ${generalBrightnessMaxSlider.value()}%`); // NEW: Update general brightness max label

  if (!currentState || !currentState.geometry) {
    return;
  }

  let collisionDetected = currentState.collisionDetected || false;
  const radii = currentState.radii || {};
  rPelvis = radii.rPelvis != null ? radii.rPelvis : 0;
  rSpine = radii.rSpine != null ? radii.rSpine : 0;
  rTorso = radii.rTorso != null ? radii.rTorso : 0;
  rSkull = radii.rSkull != null ? radii.rSkull : 0;
  rBlade = radii.rBlade != null ? radii.rBlade : 0;
  const bladeRandomRotation = currentState.bladeRandomRotation || 0;

  push();
  translate(width / 2, height / 2);

  // Get the current overall scale value
  // currentOverallScale is already randomized in the do-while loop

  // Calculate tangent and perpendicular for Point 2 (needed for blades and arms)
  let tangentX_p2 = bezierTangent(x1, cx1, cx2, x2, tPoint2);
  let tangentY_p2 = bezierTangent(y1, cy1, cy2, y2, tPoint2);

  let perpX_p2 = -tangentY_p2;
  let perpY_p2 = tangentX_p2;

  let mag_p2 = sqrt(perpX_p2 * perpX_p2 + perpY_p2 * perpY_p2);
  if (mag_p2 === 0) {
    perpX_p2 = 1;
    perpY_p2 = 0;
    mag_p2 = 1;
  }
  let normPerpX_p2 = perpX_p2 / mag_p2;
  let normPerpY_p2 = perpY_p2 / mag_p2;

  // Tangent for the initial point (for image rotation) - calculated here to be accessible for point marker
  let tangentX_initial = bezierTangent(x1, cx1, cx2, x2, 0);
  let tangentY_initial = bezierTangent(y1, cy1, cy2, y2, 0);

  // Tangent for Point 1 (for image rotation)
  let tangentX_p1 = bezierTangent(x1, cx1, cx2, x2, tPoint1);
  let tangentY_p1 = bezierTangent(y1, cy1, cy2, y2, tPoint1);

  if (showDebugElementsCheckbox.checked()) {
    // Draw the bezier curve
    stroke(200, 200, 255);
    strokeWeight(3);
    noFill();
    // Bezier coordinates are already scaled in the calculation above
    bezier(x1, y1, cx1, cy1, cx2, cy2, x2, y2);

    // --- Draw the perpendicular line at the terminal point ---
    let lineLength = 75 * currentOverallScale; // Use a stable length for debug lines
    let halfLineLength = lineLength / 2;

    // Get the tangent vector at the terminal point (t=1)
    let tangentX_terminal = x2 - cx2;
    let tangentY_terminal = y2 - cy2;

    // Calculate a perpendicular vector (-dy, dx)
    let perpX_terminal = -tangentY_terminal;
    let perpY_terminal = tangentX_terminal;

    // Normalize the perpendicular vector
    let mag_terminal = sqrt(perpX_terminal * perpX_terminal + perpY_terminal * perpY_terminal);
    if (mag_terminal === 0) {
      perpX_terminal = 1;
      perpY_terminal = 0;
      mag_terminal = 1;
    }
    let normPerpX_terminal = perpX_terminal / mag_terminal;
    let normPerpY_terminal = perpY_terminal / mag_terminal;

    // Scale the normalized perpendicular vector to half the desired line length
    let scaledPerpX_terminal = normPerpX_terminal * halfLineLength;
    let scaledPerpY_terminal = normPerpY_terminal * halfLineLength;

    // Calculate the endpoints of the perpendicular line
    let lineStartX_terminal = p2x - scaledPerpX_terminal;
    let lineStartY_terminal = p2y - scaledPerpY_terminal;
    let lineEndX_terminal = p2x + scaledPerpX_terminal;
    let lineEndY_terminal = p2y + scaledPerpY_terminal;

    // Draw the perpendicular line for terminal point
    stroke(50, 50, 255);
    strokeWeight(2);
    line(lineStartX_terminal, lineStartY_terminal, lineEndX_terminal, lineEndY_terminal);

    // --- Draw the perpendicular line at Point 2 ---
    // Use the already calculated normPerpX_p2 and normPerpY_p2
    let scaledPerpX_p2 = normPerpX_p2 * lineLength * 2;
    let scaledPerpY_p2 = normPerpY_p2 * lineLength * 2;

    // Calculate the endpoints of the perpendicular line for Point 2
    let lineStartX_p2 = pPoint2X - scaledPerpX_p2;
    let lineStartY_p2 = pPoint2Y - scaledPerpY_p2;
    let lineEndX_p2 = pPoint2X + scaledPerpX_p2;
    let lineEndY_p2 = pPoint2Y + scaledPerpY_p2;

    // Draw the perpendicular line for Point 2
    stroke(255, 140, 0);
    strokeWeight(2);
    line(lineStartX_p2, lineStartY_p2, lineEndX_p2, lineEndY_p2);

    // --- Draw the perpendicular line at Point 1 ---
    let perpX_p1 = -tangentY_p1;
    let perpY_p1 = tangentX_p1;

    let mag_p1 = sqrt(perpX_p1 * perpX_p1 + perpY_p1 * perpY_p1);
    if (mag_p1 === 0) {
      perpX_p1 = 1;
      perpY_p1 = 0;
      mag_p1 = 1;
    }
    let normPerpX_p1 = perpX_p1 / mag_p1;
    let normPerpY_p1 = perpY_p1 / mag_p1;

    let scaledPerpX_p1 = normPerpX_p1 * halfLineLength;
    let scaledPerpY_p1 = normPerpY_p1 * halfLineLength;

    stroke(255, 255, 50);
    strokeWeight(2);
    line(pPoint1X - scaledPerpX_p1, pPoint1Y - scaledPerpY_p1, pPoint1X + scaledPerpX_p1, pPoint1Y + scaledPerpY_p1);

    // Circle properties
    let baseCircleSize = 15 * currentOverallScale; // Scale circle size
    let glowSize = baseCircleSize * 2.5;
    let glowAlpha = map(sin(frameCount * 0.05), -1, 1, 30, 100);

    noStroke();

    colorMode(RGB, 255, 255, 255, 255); // Temporarily switch to RGB for debug colors

    // Initial point (Red) - Circle and Perpendicular line (always drawn as point markers)
    fill(255, 0, 0, glowAlpha);
    ellipse(p1x, p1y, glowSize, glowSize);
    fill(255, 0, 0);
    ellipse(p1x, p1y, baseCircleSize, baseCircleSize);

    let perpX_initial = -tangentY_initial;
    let perpY_initial = tangentX_initial;

    let mag_initial = sqrt(perpX_initial * perpX_initial + perpY_initial * perpY_initial);
    if (mag_initial === 0) {
      perpX_initial = 1;
      perpY_initial = 0;
      mag_initial = 1;
    }
    let normPerpX_initial = perpX_initial / mag_initial;
    let normPerpY_initial = perpY_initial / mag_initial;

    let scaledPerpX_initial = normPerpX_initial * halfLineLength;
    let scaledPerpY_initial = normPerpY_initial * halfLineLength;

    stroke(255, 0, 0);
    strokeWeight(2);
    line(p1x - scaledPerpX_initial, p1y - scaledPerpY_initial, p1x + scaledPerpX_initial, p1y + scaledPerpY_initial);


    // Draw collision detection circles if checkbox is checked
    if (collisionDetectionCheckbox.checked()) {
      push();
      noFill();
      stroke(255, 0, 255);
      strokeWeight(2);

      // Pelvis collision circle
      if (rPelvis > 0) ellipse(p1x, p1y + (80 * currentOverallScale), rPelvis * 2, rPelvis * 2); // Scale offset

      // Spine collision circle
      if (rSpine > 0) ellipse(pPoint1X, pPoint1Y, rSpine * 2, rSpine * 2);

      // Torso collision circle
      if (rTorso > 0) {
        let effectiveTorsoCollisionOffsetY = 0;
        if (currentTorsoSize === "large") {
          effectiveTorsoCollisionOffsetY = torsoCollisionOffsetYLarge * currentOverallScale;
        }
        ellipse(pPoint2X, pPoint2Y + effectiveTorsoCollisionOffsetY, rTorso * 2, rTorso * 2);
      }

      // Skull/Head collision circle (still drawn for visual reference, but not part of collision logic)
      if (rSkull > 0) ellipse(p2x, p2y, rSkull * 2, rSkull * 2);

      // Blade collision circle (for visual reference) for bladeFront
      if (rBlade > 0) {
        let effectiveBladeDistFront = bladeFrontDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
        let bladeFrontApproxX = pPoint2X + normPerpX_p2 * effectiveBladeDistFront * bladeFrontSideOffset;
        let bladeFrontApproxY = pPoint2Y + normPerpY_p2 * effectiveBladeDistFront * bladeFrontSideOffset;
        ellipse(bladeFrontApproxX, bladeFrontApproxY, rBlade * 2, rBlade * 2);
      }

      // Blade collision circle (for visual reference) for bladeBack
      if (rBlade > 0) {
        let effectiveBladeDistBack = bladeBackDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
        let bladeBackApproxX = pPoint2X + normPerpX_p2 * effectiveBladeDistBack * bladeBackSideOffset;
        let bladeBackApproxY = pPoint2Y + normPerpY_p2 * effectiveBladeDistBack * bladeBackSideOffset;
        ellipse(bladeBackApproxX, bladeBackApproxY, rBlade * 2, rBlade * 2);
      }

      pop();
    }

    // Terminal point (blue) - Circle (kept for visual reference on the point)
    fill(100, 100, 255, glowAlpha);
    ellipse(p2x, p2y, glowSize, glowSize);
    fill(50, 50, 255);
    ellipse(p2x, p2y, baseCircleSize, baseCircleSize);
    colorMode(HSB, 360, 100, 100, 255); // Switch back to HSB for skeleton drawing
  }

  // Only draw body parts if no collision detected OR if collision detection is turned off
  if (!collisionDetected || !collisionDetectionCheckbox.checked()) {

    // Safely calculate required compensations if images exist
    let pelvisScaleCompensationX = 0;
    let pelvisOffsetYCompensation = 0;
    if (currentSkeletonImages.pelvis) {
      // Calculate the X offset compensation for pelvis scaling (only on X-axis)
      pelvisScaleCompensationX = (currentSkeletonImages.pelvis.width / 2) * currentOverallScale * (pelvisRandomScaleFactor - 1);
      // Apply the new compensation factor to reduce its effect
      pelvisScaleCompensationX *= PELVIS_LEG_X_COMPENSATION_FACTOR;
      // Calculate the Y offset for pelvis to compensate for X-axis scaling
      pelvisOffsetYCompensation = (currentSkeletonImages.pelvis.height * currentOverallScale * (pelvisRandomScaleFactor - 1)) / 2;
      // Apply the new compensation factor to reduce its effect
      pelvisOffsetYCompensation *= PELVIS_Y_COMPENSATION_FACTOR; // NEW: Apply Y compensation factor
    }

    let torsoScaleCompensationX = 0;
    if (currentSkeletonImages.torso) {
      // Calculate the X offset compensation for torso scaling (only on X-axis)
      // If torso scales up, blades move outwards. If scales down, inwards.
      torsoScaleCompensationX = (currentSkeletonImages.torso.width / 2) * currentOverallScale * (torsoRandomScaleFactor - 1);
      // Apply the tuneable compensation factor
      torsoScaleCompensationX *= bladeXCompensationFactor;
    }

    // Calculate effective leg offsets based on pelvis size, applying overall scale AND pelvis scale compensation
    let effectiveLegBackOffsetX = (baseLegBackOffsetX + legSizeAdjustments[currentPelvisSize].backX) * currentOverallScale - pelvisScaleCompensationX;
    let effectiveLegBackOffsetY = (baseLegBackOffsetY + legSizeAdjustments[currentPelvisSize].backY) * currentOverallScale;
    let effectiveLegFrontOffsetX = (baseLegFrontOffsetX + legSizeAdjustments[currentPelvisSize].frontX) * currentOverallScale + pelvisScaleCompensationX;
    let effectiveLegFrontOffsetY = (baseLegFrontOffsetY + legSizeAdjustments[currentPelvisSize].frontY) * currentOverallScale;

    // Draw the Blade Back (under torso, right side, flipped horizontally)
    if (currentSkeletonImages.bladeBack) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistBack = bladeBackDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;

      // normPerpX_p2 and normPerpY_p2 give the direction of the perpendicular line.
      // We want to move along this line by `effectiveBladeDist` in the `bladeBackSideOffset` direction.
      let bladeBackPosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistBack * bladeBackSideOffset);
      let bladeBackPosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistBack * bladeBackSideOffset);

      translate(bladeBackPosX, bladeBackPosY);

      // Rotate the blade to align with the perpendicular line and add random rotation
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade + bladeRandomRotation);
      scale(-1, 1); // Flip horizontally AFTER rotation to maintain correct orientation relative to the line

      image(
        currentSkeletonImages.bladeBack,
        (bladeBackOffsetX + torsoScaleCompensationX * bladeBackSideOffset) * currentOverallScale, // Apply scaled offset and compensation
        bladeBackOffsetY * currentOverallScale, // Scale offset
        currentSkeletonImages.bladeBack.width * bladeBackScaleX * currentOverallScale,
        currentSkeletonImages.bladeBack.height * bladeBackScaleY * currentOverallScale
      );
      pop();
    }

    // NEW: Draw Arm Back (behind everything but the blade back)
    if (currentSkeletonImages.armBack) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistBack = bladeBackDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
      let armBackPosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistBack * bladeBackSideOffset);
      let armBackPosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistBack * bladeBackSideOffset);

      translate(armBackPosX, armBackPosY);

      // Apply the same rotation as the back blade
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade + bladeRandomRotation);
      // No longer flipping horizontally

      image(
        currentSkeletonImages.armBack,
        (armBackOffsetX + torsoScaleCompensationX * bladeBackSideOffset) * currentOverallScale, // Apply armBackOffsetX and compensation
        armBackOffsetY * currentOverallScale, // Apply armBackOffsetY
        currentSkeletonImages.armBack.width * currentOverallScale,
        currentSkeletonImages.armBack.height * currentOverallScale
      );
      pop();
    }

    // New: Draw LegBack (behind pelvis)
    if (currentSkeletonImages.legBack) {
      push();
      translate(p1x, p1y);
      // No rotation for legs
      image(
        currentSkeletonImages.legBack,
        effectiveLegBackOffsetX,
        effectiveLegBackOffsetY,
        currentSkeletonImages.legBack.width * currentOverallScale,
        currentSkeletonImages.legBack.height * currentOverallScale
      );
      pop();
    }

    // Initial point (now an image) - Pelvis
    if (currentSkeletonImages.pelvis) {
      push();
      translate(p1x, p1y);
      // Calculate the angle for pelvis image rotation
      let anglePelvis = atan2(tangentY_initial, tangentX_initial) + HALF_PI;
      rotate(anglePelvis);

      image(
        currentSkeletonImages.pelvis,
        pelvisOffsetX * currentOverallScale,
        pelvisOffsetY * currentOverallScale - pelvisOffsetYCompensation,
        currentSkeletonImages.pelvis.width * currentOverallScale * pelvisRandomScaleFactor,
        currentSkeletonImages.pelvis.height * currentOverallScale
      );
      pop();
    }

    // New: Draw LegFront (over pelvis)
    if (currentSkeletonImages.legFront) {
      push();
      translate(p1x, p1y);
      // No rotation for legs
      image(
        currentSkeletonImages.legFront,
        effectiveLegFrontOffsetX,
        effectiveLegFrontOffsetY,
        currentSkeletonImages.legFront.width * currentOverallScale,
        currentSkeletonImages.legFront.height * currentOverallScale
      );
      pop();
    }

    // Draw Blade Front (under torso, left side, on p2 perpendicular line) - Renamed
    if (currentSkeletonImages.bladeFront) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistFront = bladeFrontDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;

      // normPerpX_p2 and normPerpY_p2 give the direction of the perpendicular line.
      // We want to move along this line by `effectiveBladeDist` in the `bladeFrontSideOffset` direction.
      let bladeFrontPosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistFront * bladeFrontSideOffset);
      let bladeFrontPosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistFront * bladeFrontSideOffset);

      translate(bladeFrontPosX, bladeFrontPosY);

      // Rotate the blade to align with the perpendicular line and add inverted random rotation
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade - bladeRandomRotation); // Inverted rotation for front blade

      image(
        currentSkeletonImages.bladeFront,
        (bladeFrontOffsetX + torsoScaleCompensationX * bladeFrontSideOffset) * currentOverallScale,
        bladeFrontOffsetY * currentOverallScale,
        currentSkeletonImages.bladeFront.width * bladeFrontScaleX * currentOverallScale,
        currentSkeletonImages.bladeFront.height * bladeFrontScaleY * currentOverallScale
      );
      pop();
    }

    // New Point 2 (Orange) - Now with Torso Image
    if (currentSkeletonImages.torso) {
      push();
      translate(pPoint2X, pPoint2Y);

      // Calculate the angle of the tangent at Point 2
      let angleP2 = atan2(tangentY_p2, tangentX_p2);
      rotate(angleP2 + HALF_PI);

      image(
        currentSkeletonImages.torso,
        torsoOffsetX * currentOverallScale,
        torsoOffsetY * currentOverallScale,
        currentSkeletonImages.torso.width * currentOverallScale * torsoRandomScaleFactor,
        currentSkeletonImages.torso.height * currentOverallScale * torsoRandomScaleFactor
      );
      pop();
    }

    // New Point 1 (Yellow) - Now with Spine Image (MOVED AFTER TORSO)
    if (currentSkeletonImages.spine) {
      push();
      translate(pPoint1X, pPoint1Y);

      // Calculate the angle of the tangent at Point 1
      let angleP1 = atan2(tangentY_p1, tangentX_p1);
      rotate(angleP1 + HALF_PI);

      // Draw the spine image
      image(
        currentSkeletonImages.spine,
        spineOffsetX * currentOverallScale,
        spineOffsetY * currentOverallScale,
        currentSkeletonImages.spine.width * currentOverallScale,
        currentSkeletonImages.spine.height * currentOverallScale
      );
      pop();
    }

    // Terminal point (blue) - Now with multiple assets
    if (currentSkeletonImages.skull || currentSkeletonImages.jaw || currentSkeletonImages.mark || currentSkeletonImages.nose || currentSkeletonImages.eye || currentSkeletonImages.pupil) {
      
      // Safely calculate head scale compensation if skull is present
      let headScaleCompensationY = 0;
      if (currentSkeletonImages.skull) {
        let baseSkullHeight = currentSkeletonImages.skull.height * currentOverallScale;
        headScaleCompensationY = baseSkullHeight * (headRandomScaleFactor - 1) / 2;
      }
      
      push();
      translate(p2x, p2y);

      // Apply the calculated head rotation
      rotate(radians(headRotationAngle));

      // Draw skulls
      if (currentSkeletonImages.skull) {
        image(
          currentSkeletonImages.skull,
          skullOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          skullOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.skull.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.skull.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // Draw jaws
      if (currentSkeletonImages.jaw) {
        image(
          currentSkeletonImages.jaw,
          jawOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          jawOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.jaw.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.jaw.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // Draw marks
      if (currentSkeletonImages.mark) {
        image(
          currentSkeletonImages.mark,
          markOffsetX * currentOverallScale + (headXOffset * currentOverallScale),
          (markOffsetY + markHeightAdjustments[currentSkullSize]) * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.mark.width * currentOverallScale * headRandomScaleFactor, // FIXED: Changed .markWidth to .width
          currentSkeletonImages.mark.height * currentOverallScale * headRandomScaleFactor // FIXED: Changed .markHeight to .height
        );
      }

      // Draw noses
      if (currentSkeletonImages.nose) {
        image(
          currentSkeletonImages.nose,
          noseOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          noseOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.nose.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.nose.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // Draw eyes
      if (currentSkeletonImages.eye) {
        image(
          currentSkeletonImages.eye,
          eyeOffsetX * currentOverallScale + headXOffset * currentOverallScale,
          eyeOffsetY * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.eye.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.eye.height * currentOverallScale * headRandomScaleFactor
        );
      }

      // New: Draw pupils (last head element)
      if (currentSkeletonImages.pupil) {
        const pjx = currentState && currentState.pupilJitterX != null ? currentState.pupilJitterX : 0;
        const pjy = currentState && currentState.pupilJitterY != null ? currentState.pupilJitterY : 0;
        image(
          currentSkeletonImages.pupil,
          pupilOffsetX * currentOverallScale + headXOffset * currentOverallScale + pjx * currentOverallScale,
          pupilOffsetY * currentOverallScale + pjy * currentOverallScale - headScaleCompensationY,
          currentSkeletonImages.pupil.width * currentOverallScale * headRandomScaleFactor,
          currentSkeletonImages.pupil.height * currentOverallScale * headRandomScaleFactor
        );
      }
      pop();
    }

    // NEW: Draw Arm Front Idle (over all other elements)
    if (currentSkeletonImages.armFrontIdle) {
      push();
      // Calculate the position along the perpendicular line relative to pPoint2X, pPoint2Y
      let effectiveBladeDistFront = bladeFrontDist * bladeSizeAdjustments[currentTorsoSize].distFactor * currentOverallScale;
      let armFrontIdlePosX = pPoint2X + (normPerpX_p2 * effectiveBladeDistFront * bladeFrontSideOffset);
      let armFrontIdlePosY = pPoint2Y + (normPerpY_p2 * effectiveBladeDistFront * bladeFrontSideOffset);

      translate(armFrontIdlePosX, armFrontIdlePosY);

      // Apply the same rotation as the front blade
      let angleBlade = atan2(normPerpY_p2, normPerpX_p2);
      rotate(angleBlade - bladeRandomRotation); // Inverted rotation for front blade

      image(
        currentSkeletonImages.armFrontIdle,
        (armFrontOffsetX + torsoScaleCompensationX * bladeFrontSideOffset) * currentOverallScale, // Apply armFrontOffsetX and compensation
        armFrontOffsetY * currentOverallScale, // Apply armFrontOffsetY
        currentSkeletonImages.armFrontIdle.width * currentOverallScale,
        currentSkeletonImages.armFrontIdle.height * currentOverallScale
      );
      pop();
    }
  }

  pop();

  // Calculate magnitudes relative to the canvas center (before translation)
  let mag2 = dist(width / 2, height / 2, p2x + width / 2, p2y + height / 2);

  // --- Update content of the infoPanel divs ---
  // Current Randomized Values Section
  let randHtml = "<b>--- Current Randomized Values ---" + "</b><br>";
  randHtml += `Initial Angle: ${nfc(initialAngle, 2)}°<br>`;
  randHtml += `Initial Intensity: ${nfc(initialIntensity, 2)}<br>`;
  randHtml += `Terminal Angle: ${nfc(terminalAngle, 2)}°<br>`;
  randHtml += `Terminal Intensity: ${nfc(terminalIntensity, 2)}<br>`;
  randHtml += `Vertical Displacement: ${nfc(randomVerticalLength, 2)}<br>`;
  randHtml += `Point 1 Position (t-value): ${nfc(tPoint1, 2)}<br>`; // Display randomized tPoint1
  randHtml += `Point 2 Position (t-value): ${nfc(tPoint2, 2)}<br>`; // Display randomized tPoint2
  randHtml += `Overall Skeleton Scale: ${nfc(currentOverallScale, 2)}x<br>`; // UPDATED: Display randomized overall skeleton scale
  randHtml += `Terminal X Offset: ${nfc(terminalPointXOffset, 2)}<br>`;
  randHtml += `Head X Offset: ${nfc(headXOffset, 2)}<br>`;
  randHtml += `Head Random Scale: ${nfc(headRandomScaleFactor * 100, 0)}%<br>`; // UPDATED: Display head random scale factor as percentage
  randHtml += `Pelvis Random Scale: ${nfc(pelvisRandomScaleFactor * 100, 0)}%<br>`; // NEW: Display pelvis random scale factor as percentage
  randHtml += `Torso Random Scale: ${nfc(torsoRandomScaleFactor * 100, 0)}%<br>`; // NEW: Display torso random scale factor as percentage
  randHtml += `Head Rotation: ${nfc(headRotationAngle, 2)}°<br>`;
  randHtml += `Pelvis Size: ${currentPelvisSize}<br>`;
  randHtml += `Torso Size: ${currentTorsoSize}<br>`;
  randHtml += `Skull Size: ${currentSkullSize}<br>`; // NEW: Display skull size
  randHtml += `Skeleton Green Hue: ${nfc(currentSkeletonGreenHue, 0)}°<br>`; // NEW: Display current skeleton green hue
  randHtml += `Skeleton Green Saturation: ${nfc(currentSkeletonGreenSaturation, 0)}%<br>`; // NEW: Display current skeleton green saturation
  randHtml += `Skeleton Green Brightness: ${nfc(currentSkeletonGreenBrightness, 0)}%<br>`; // NEW: Display current skeleton green brightness
  randHtml += `Skeleton General Brightness: ${nfc(currentSkeletonGeneralBrightness, 0)}%<br>`; // NEW: Display current skeleton general brightness
  currentRandomizedValuesDiv.html(randHtml);

  // Curve Point Coordinates Section
  let curveHtml = "<b>--- Curve Point Coordinates ---" + "</b><br>";
  curveHtml += `Initial Point (Red):<br>`;
  curveHtml += `  X: ${nfc(p1x, 2)}, Y: ${nfc(p1y, 2)}<br>`;
  curveHtml += `Point 1 (Yellow):<br>`;
  curveHtml += `  X: ${nfc(pPoint1X, 2)}, Y: ${nfc(pPoint1Y, 2)}<br>`;
  curveHtml += `Point 2 (Orange):<br>`;
  curveHtml += `  X: ${nfc(pPoint2X, 2)}, Y: ${nfc(pPoint2Y, 2)}<br>`;
  curveHtml += `Terminal Point (Blue):<br>`;
  curveHtml += `  X: ${nfc(p2x, 2)}, Y: ${nfc(p2y, 2)}<br>`;
  curveHtml += `  Magnitude: ${nfc(mag2, 2)}<br>`;
  curvePointCoordinatesDiv.html(curveHtml);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Adjust infoPanel position on resize
  infoPanel.position(width - 270, 10);
}

// REMOVED: The hardcoded ASSET_URLS object is now replaced by the dynamically loaded assetLibraryData.
