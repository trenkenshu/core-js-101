/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
  return this;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  function C() {
    return this;
  }
  const input = JSON.parse(json);
  const keys = Object.keys(input);
  const ans = new C();
  Object.setPrototypeOf(ans, proto);
  for (let i = 0; i < keys.length; i += 1) {
    ans[keys[i]] = input[keys[i]];
  }
  return ans;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  line: '',
  order: [],
  element(el) {
    this.validate('element');
    this.line += el;
    this.order.push('element');
    const obj = Object.create(cssSelectorBuilder);
    this.addProperty(obj, 'line');
    this.addProperty(obj, 'order');
    this.order = [];
    this.line = '';
    return obj;
  },

  id(val) {
    this.validate('id');
    this.line += '#';
    this.line += val;
    this.order.push('id');
    const obj = Object.create(cssSelectorBuilder);
    this.addProperty(obj, 'line');
    this.addProperty(obj, 'order');
    this.order = [];
    this.line = '';
    return obj;
  },

  class(cl) {
    this.validate('class');
    this.line += '.';
    this.line += cl;
    this.order.push('class');
    const obj = Object.create(cssSelectorBuilder);
    this.addProperty(obj, 'line');
    this.addProperty(obj, 'order');
    this.order = [];
    this.line = '';
    return obj;
  },

  attr(a) {
    this.validate('attr');
    this.line += '[';
    this.line += a;
    this.line += ']';
    this.order.push('attr');
    const obj = Object.create(cssSelectorBuilder);
    this.addProperty(obj, 'line');
    this.addProperty(obj, 'order');
    this.order = [];
    this.line = '';
    return obj;
  },

  pseudoClass(ps) {
    this.validate('pseudoClass');
    this.line += ':';
    this.line += ps;
    this.order.push('pseudoClass');
    const obj = Object.create(cssSelectorBuilder);
    this.addProperty(obj, 'line');
    this.addProperty(obj, 'order');
    this.order = [];
    this.line = '';
    return obj;
  },

  pseudoElement(pse) {
    this.validate('pseudoElement');
    this.line += '::';
    this.line += pse;
    this.order.push('pseudoElement');
    const obj = Object.create(cssSelectorBuilder);
    this.addProperty(obj, 'line');
    this.addProperty(obj, 'order');
    this.order = [];
    this.line = '';
    return obj;
  },

  combine(...args) {
    let temp = '';
    for (let i = 0; i < args.length; i += 1) {
      temp += args[i];
      if (i < args.length - 1) {
        temp += ' ';
      }
    }
    this.line = temp;
    return this;
  },

  stringify() {
    const temp = this.line;
    this.line = '';
    this.order = [];
    return temp;
  },

  toString() {
    const temp = this.line;
    this.line = '';
    this.order = [];
    return temp;
  },

  validate(addition) {
    switch (addition) {
      case 'element':
        if (this.order.includes('element')) {
          throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        break;

      case 'id':
        if (this.order.includes('id')) {
          throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        break;

      case 'pseudoElement':
        if (this.order.includes('pseudoElement')) {
          throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        break;

      default:
    }

    switch (addition) {
      case 'element':
        if (this.order.includes('pseudoElement') || this.order.includes('class')
        || this.order.includes('pseudoClass') || this.order.includes('attr')
        || this.order.includes('id')) {
          throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;

      case 'id':
        if (this.order.includes('pseudoElement') || this.order.includes('class')
        || this.order.includes('pseudoClass') || this.order.includes('attr')) {
          throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;

      case 'class':
        if (this.order.includes('pseudoElement') || this.order.includes('attr')
          || this.order.includes('pseudoClass')) {
          throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;

      case 'attr':
        if (this.order.includes('pseudoElement') || this.order.includes('pseudoClass'
          || this.order.includes('attr'))) {
          throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;

      case 'pseudoClass':
        if (this.order.includes('pseudoElement')) {
          throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
        break;

      default:
    }
    return true;
  },

  addProperty(obj, name) {
    Object.defineProperty(obj, name, {
      value: this[name],
      writable: true,
      configurable: true,
    });
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
