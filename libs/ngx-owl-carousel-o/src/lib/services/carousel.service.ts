import { Injectable } from '@angular/core';

import { CustomEventsService } from '../services/custom-events.service';

export class States {
  current: {};
  tags: {
    [key: string]: string[];
  };
}
@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  /**
   * Invalidated parts within the update process.
   */
  protected _invalidated: any = {};

  // is needed for tests
  get invalidated() {
    return this._invalidated;
  }
  /**
   * Current state information and their tags.
   * @type ff {Object}
   */
  protected _states: States = {
    current: {},
    tags: {
      initializing: ['busy'],
      animating: ['busy'],
      dragging: ['interacting']
    }
  };

  // is needed for tests
  get states() {
    return this._states;
  }

  constructor(private customEventsCreator: CustomEventsService) { }

  /**
	 * Initializes the carousel.
	 * @protected
	 */
  initialize() {
		// this.enter('initializing');
		// this.trigger('initialize');

		// this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl);

		// if (this.settings.autoWidth && !this.is('pre-loading')) {
		// 	var imgs, nestedSelector, width;
		// 	imgs = this.$element.find('img');
		// 	nestedSelector = this.settings.nestedItemSelector ? '.' + this.settings.nestedItemSelector : undefined;
		// 	width = this.$element.children(nestedSelector).width();

		// 	if (imgs.length && width <= 0) {
		// 		this.preloadAutoWidthImages(imgs);
		// 	}
		// }

		// this.$element.addClass(this.options.loadingClass);

		// // create stage
		// this.$stage = $('<' + this.settings.stageElement + ' class="' + this.settings.stageClass + '"/>')
		// 	.wrap('<div class="' + this.settings.stageOuterClass + '"/>');

		// // append stage
		// this.$element.append(this.$stage.parent());

		// // append content
		// this.replace(this.$element.children().not(this.$stage.parent()));

		// // check visibility
		// if (this.$element.is(':visible')) {
		// 	// update view
		// 	this.refresh();
		// } else {
		// 	// invalidate width
		// 	this.invalidate('width');
		// }

		// this.$element
		// 	.removeClass(this.options.loadingClass)
		// 	.addClass(this.options.loadedClass);

		// // register event handlers
		// this.registerEventHandlers();

		// this.leave('initializing');
		// this.trigger('initialized');
  };

  /**
	 * Setups the current settings.
	 * @todo Remove responsive classes. Why should adaptive designs be brought into IE8?
	 * @todo Support for media queries by using `matchMedia` would be nice.
	 * @public
	 */
  setup() { }

  /**
	 * Updates option logic if necessery.
	 * @protected
	 */
  optionsLogic() { }

  /**
	 * Prepares an item before add.
	 * @todo Rename event parameter `content` to `item`.
	 * @protected
	 * @returns {jQuery|HTMLElement} - The item container.
	 */
  prepare(item) { }

  /**
   * Updates the view.
   * @param workers - list of functions: workers
   */
  update(workers: any[]) {
    let i = 0;
    const n = workers.length,
      filter = item => this._invalidated[item],
      cache = {};

    while (i < n) {
      const filteredPipe = workers[i].filter.filter(filter);
      if (this._invalidated.all || filteredPipe.length > 0) {
        workers[i].run(cache);
      }
      i++;
    }

    this._invalidated = {};

    if (!this.is('valid')) {
      this.enter('valid');
    }
  }

  /**
	 * Gets the width of the view.
	 * @public
	 * @param {Owl.Width} [dimension=Owl.Width.Default] - The dimension to return.
	 * @returns {Number} - The width of the view in pixel.
	 */
  width(dimension) { }

  /**
	 * Refreshes the carousel primarily for adaptive purposes.
	 * @public
	 */
  refresh() { }

  /**
	 * Checks window `resize` event.
	 * @protected
	 */
	onThrottledResize() { }

  /**
	 * Checks window `resize` event.
	 * @protected
	 */
  onResize() { }

  /**
	 * Registers event handlers.
	 * @todo Check `msPointerEnabled`
	 * @todo #261
	 * @protected
	 */
  registerEventHandlers() { }

  /**
	 * Handles `touchstart` and `mousedown` events.
	 * @todo Horizontal swipe threshold as option
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
  onDragStart(event) { }

  /**
	 * Handles the `touchmove` and `mousemove` events.
	 * @todo #261
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
  onDragMove(event) { }

  /**
	 * Handles the `touchend` and `mouseup` events.
	 * @todo #261
	 * @todo Threshold for click event
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
  onDragEnd(event) { }

  	/**
	 * Gets absolute position of the closest item for a coordinate.
	 * @todo Setting `freeDrag` makes `closest` not reusable. See #165.
	 * @protected
	 * @param {Number} coordinate - The coordinate in pixel.
	 * @param {String} direction - The direction to check for the closest item. Ether `left` or `right`.
	 * @return {Number} - The absolute position of the closest item.
	 */
  closest(coordinate, direction) { }

  /**
	 * Animates the stage.
	 * @todo #270
	 * @public
	 * @param {Number} coordinate - The coordinate in pixels.
	 */
  animate(coordinate) { }

  /**
	 * Checks whether the carousel is in a specific state or not.
	 * @param state - The state to check.
	 * @return} - The flag which indicates if the carousel is busy.
	 */
  is(state: string): boolean {
		return this._states.current[state] && this._states.current[state] > 0;
  };

  /**
	 * Sets the absolute position of the current item.
	 * @public
	 * @param {Number} [position] - The new absolute position or nothing to leave it unchanged.
	 * @returns {Number} - The absolute position of the current item.
	 */
  current(position) { }

  /**
	 * Invalidates the given part of the update routine.
	 * @param [part] - The part to invalidate.
	 * @returns - The invalidated parts.
	 */
  invalidate(part: string): string[] {
		if (typeof part === 'string') {
			this._invalidated[part] = true;
			if(this.is('valid')) { this.leave('valid'); }
		}
		return Object.keys(this._invalidated);
  };

	/**
	 * Resets the absolute position of the current item.
	 * @public
	 * @param {Number} position - The absolute position of the new item.
	 */
  reset(position) { }

  /**
	 * Normalizes an absolute or a relative position of an item.
	 * @public
	 * @param {Number} position - The absolute or relative position to normalize.
	 * @param {Boolean} [relative=false] - Whether the given position is relative or not.
	 * @returns {Number} - The normalized position.
	 */
  normalize(position, relative) { }

  /**
	 * Converts an absolute position of an item into a relative one.
	 * @public
	 * @param {Number} position - The absolute position to convert.
	 * @returns {Number} - The converted position.
	 */
  relative(position) { }

  /**
	 * Gets the maximum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
  maximum(relative) { }

  /**
	 * Gets the minimum position for the current item.
	 * @public
	 * @param {Boolean} [relative=false] - Whether to return an absolute position or a relative position.
	 * @returns {Number}
	 */
  minimum(relative) { }

  /**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
  items(position) { }

  /**
	 * Gets an item at the specified relative position.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @return {jQuery|Array.<jQuery>} - The item at the given position or all items if no position was given.
	 */
  mergers(position) { }

  /**
	 * Gets the absolute positions of clones for an item.
	 * @public
	 * @param {Number} [position] - The relative position of the item.
	 * @returns {Array.<Number>} - The absolute positions of clones for the item or all if no position was given.
	 */
  clones(position) { }

  /**
	 * Sets the current animation speed.
	 * @public
	 * @param {Number} [speed] - The animation speed in milliseconds or nothing to leave it unchanged.
	 * @returns {Number} - The current animation speed in milliseconds.
	 */
  speed(speed) { }

  /**
	 * Gets the coordinate of an item.
	 * @todo The name of this method is missleanding.
	 * @public
	 * @param {Number} position - The absolute position of the item within `minimum()` and `maximum()`.
	 * @returns {Number|Array.<Number>} - The coordinate of the item in pixel or all coordinates.
	 */
  coordinates(position) { }

  /**
	 * Calculates the speed for a translation.
	 * @protected
	 * @param {Number} from - The absolute position of the start item.
	 * @param {Number} to - The absolute position of the target item.
	 * @param {Number} [factor=undefined] - The time factor in milliseconds.
	 * @returns {Number} - The time in milliseconds for the translation.
	 */
  duration(from, to, factor) { }

  	/**
	 * Slides to the specified item.
	 * @public
	 * @param {Number} position - The position of the item.
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
  to(position, speed) { }

  /**
	 * Slides to the next item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
  next(speed) { }

  /**
	 * Slides to the previous item.
	 * @public
	 * @param {Number} [speed] - The time in milliseconds for the transition.
	 */
  prev(speed) { }

  	/**
	 * Handles the end of an animation.
	 * @protected
	 * @param {Event} event - The event arguments.
	 */
  onTransitionEnd(event) { }

  /**
	 * Gets viewport width.
	 * @protected
	 * @return {Number} - The width in pixel.
	 */
  viewport() { }

  /**
	 * Replaces the current content.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The new content.
	 */
  replace(content) { }

  	/**
	 * Adds an item.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {HTMLElement|jQuery|String} content - The item content to add.
	 * @param {Number} [position] - The relative position at which to insert the item otherwise the item will be added to the end.
	 */
  add(content, position) { }

  /**
	 * Removes an item by its position.
	 * @todo Use `item` instead of `content` for the event arguments.
	 * @public
	 * @param {Number} position - The relative position of the item to remove.
	 */
  remove(position) { }

  /**
	 * Preloads images with auto width.
	 * @todo Replace by a more generic approach
	 * @protected
	 */
	preloadAutoWidthImages(images) { }

  /**
	 * Destroys the carousel.
	 * @public
	 */
  destroy() { }

  /**
	 * Operators to calculate right-to-left and left-to-right.
	 * @protected
	 * @param {Number} [a] - The left side operand.
	 * @param {String} [o] - The operator.
	 * @param {Number} [b] - The right side operand.
	 */
  op(a, o, b) { }

  	/**
	 * Attaches to an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The event handler to attach.
	 * @param {Boolean} capture - Wether the event should be handled at the capturing phase or not.
	 */
  on(element, event, listener, capture) { }

  /**
	 * Detaches from an internal event.
	 * @protected
	 * @param {HTMLElement} element - The event source.
	 * @param {String} event - The event name.
	 * @param {Function} listener - The attached event handler to detach.
	 * @param {Boolean} capture - Wether the attached event handler was registered as a capturing listener or not.
	 */
  off(element, event, listener, capture) { }

  /**
	 * Triggers a public event.
	 * @todo Remove `status`, `relatedTarget` should be used instead.
	 * @protected
	 * @param {String} name - The event name.
	 * @param {*} [data=null] - The event data.
	 * @param {String} [namespace=carousel] - The event namespace.
	 * @param {String} [state] - The state which is associated with the event.
	 * @param {Boolean} [enter=false] - Indicates if the call enters the specified state or not.
	 * @returns {Event} - The event arguments.
	 */
  trigger(name, data, namespace, state, enter) { }

	/**
	 * Enters a state.
	 * @param name - The state name.
	 */
  enter(name: string) {
    [ name ].concat(this._states.tags[name] || []).forEach((stateName) => {
      if (this._states.current[stateName] === undefined) {
				this._states.current[stateName] = 0;
			}

			this._states.current[stateName]++;
    });
  };

  /**
	 * Leaves a state.
	 * @param name - The state name.
	 */
	leave(name: string) {
    [ name ].concat(this._states.tags[name] || []).forEach((stateName) => {
      if (this._states.current[stateName] === 0 || !!this._states.current[stateName]) {
        this._states.current[stateName]--;
      }
    })
  };

  /**
	 * Registers an event or state.
	 * @public
	 * @param {Object} object - The event or state to register.
	 */
  register(object) { }

  /**
	 * Suppresses events.
	 * @protected
	 * @param {Array.<String>} events - The events to suppress.
	 */
  suppress(events) { }

  /**
	 * Releases suppressed events.
	 * @protected
	 * @param {Array.<String>} events - The events to release.
	 */
  release(events) { }

  /**
	 * Gets unified pointer coordinates from event.
	 * @todo #261
	 * @protected
	 * @param {Event} - The `mousedown` or `touchstart` event.
	 * @returns {Object} - Contains `x` and `y` coordinates of current pointer position.
	 */
  pointer(event) { }

  	/**
	 * Determines if the input is a Number or something that can be coerced to a Number
	 * @protected
	 * @param {Number|String|Object|Array|Boolean|RegExp|Function|Symbol} - The input to be tested
	 * @returns {Boolean} - An indication if the input is a Number or can be coerced to a Number
	 */
  isNumeric(number) { }

  	/**
	 * Gets the difference of two vectors.
	 * @todo #261
	 * @protected
	 * @param {Object} - The first vector.
	 * @param {Object} - The second vector.
	 * @returns {Object} - The difference.
	 */
  difference(first, second) { }

}
