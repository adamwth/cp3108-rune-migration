/** 
 * Image comparison program written for NodeJS.
 * Uses the pixelmatch image comparison library.
 * Make sure to run {@code} npm install pixelmatch.
 * @author CP3108 AY17/18 Rune Migration Team
 * @version CP3108 AY17/18 Rune Auto-grading System v1.0
 */

/* Load modules and dependencies. */
const fs = require('fs'), // File System Module
      PNG = require('pngjs').PNG, // PNG decoder
      pixelmatch = require('pixelmatch'); // pixelmatch library

/* Load image directories. */
const img1_dir = 'stack_2_rcrossbb_ex1.png';
const img2_dir = 'flip_horiz(repeat_pattern(1, quarter_turn_left, (beside(rcross_bb, rcross_bb))))_ex1.png';

/* Parse images for processing. */
var img1 = fs
      .createReadStream(img1_dir)
      .pipe(new PNG())
      .on('parsed', doneReading),
    img2 = fs
      .createReadStream(img2_dir)
      .pipe(new PNG())
      .on('parsed', doneReading),
    filesRead = 0;

/**
 * Compares images, tells whether they are the same or different, and returns a 
 * diff image, in which colored regions represent the mismatch regions.
 */ 
function doneReading() {
    // Compare only when all (2) images have been read
    if (++filesRead < 2) return;

    // Create a new PNG canvas for the diff image
    var diff = new PNG({width: img1.width, height: img1.height});

    // Compare images and get the number of different pixels
    var numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, img1.width, 
      img1.height, {threshold: 0.1});

    // Log the result of comparison
    var result = numDiffPixels == 0 ? "SAME" : "DIFFERENT";
    console.log(result);
    
    // Write the diff image
    diff.pack().pipe(fs.createWriteStream('diff.png'));
}