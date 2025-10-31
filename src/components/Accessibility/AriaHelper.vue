<template>
  <component 
    :is="tag"
    :role="role"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-describedby="ariaDescribedby"
    :aria-hidden="ariaHidden"
    :aria-live="ariaLive"
    :aria-atomic="ariaAtomic"
    :aria-busy="ariaBusy"
    :aria-current="ariaCurrent"
    :aria-disabled="ariaDisabled"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
    :aria-invalid="ariaInvalid"
    :aria-pressed="ariaPressed"
    :aria-selected="ariaSelected"
    :aria-required="ariaRequired"
    :aria-readonly="ariaReadonly"
    :aria-checked="ariaChecked"
    :aria-controls="ariaControls"
    :aria-owns="ariaOwns"
    :aria-modal="ariaModal"
    :aria-orientation="ariaOrientation"
    :aria-valuemin="ariaValuemin"
    :aria-valuemax="ariaValuemax"
    :aria-valuenow="ariaValuenow"
    :aria-valuetext="ariaValuetext"
    :aria-level="ariaLevel"
    :aria-posinset="ariaPosinset"
    :aria-setsize="ariaSetsize"
    :tabindex="tabindex"
    :class="customClass"
    v-bind="$attrs"
  >
    <slot></slot>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // HTML tag
  tag: {
    type: String,
    default: 'div'
  },
  
  // ARIA role
  role: {
    type: String,
    default: null
  },
  
  // ARIA labels
  ariaLabel: {
    type: String,
    default: null
  },
  ariaLabelledby: {
    type: String,
    default: null
  },
  ariaDescribedby: {
    type: String,
    default: null
  },
  
  // ARIA states
  ariaHidden: {
    type: [Boolean, String],
    default: null
  },
  ariaLive: {
    type: String,
    default: null,
    validator: (value) => ['off', 'polite', 'assertive'].includes(value)
  },
  ariaAtomic: {
    type: [Boolean, String],
    default: null
  },
  ariaBusy: {
    type: [Boolean, String],
    default: null
  },
  ariaCurrent: {
    type: [Boolean, String],
    default: null
  },
  ariaDisabled: {
    type: [Boolean, String],
    default: null
  },
  ariaExpanded: {
    type: [Boolean, String],
    default: null
  },
  ariaHaspopup: {
    type: [Boolean, String],
    default: null
  },
  ariaInvalid: {
    type: [Boolean, String],
    default: null
  },
  ariaPressed: {
    type: [Boolean, String],
    default: null
  },
  ariaSelected: {
    type: [Boolean, String],
    default: null
  },
  ariaRequired: {
    type: [Boolean, String],
    default: null
  },
  ariaReadonly: {
    type: [Boolean, String],
    default: null
  },
  ariaChecked: {
    type: [Boolean, String],
    default: null
  },
  
  // ARIA relationships
  ariaControls: {
    type: String,
    default: null
  },
  ariaOwns: {
    type: String,
    default: null
  },
  
  // ARIA dialog
  ariaModal: {
    type: [Boolean, String],
    default: null
  },
  
  // ARIA widget
  ariaOrientation: {
    type: String,
    default: null,
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  },
  ariaValuemin: {
    type: [Number, String],
    default: null
  },
  ariaValuemax: {
    type: [Number, String],
    default: null
  },
  ariaValuenow: {
    type: [Number, String],
    default: null
  },
  ariaValuetext: {
    type: String,
    default: null
  },
  
  // ARIA structure
  ariaLevel: {
    type: [Number, String],
    default: null
  },
  ariaPosinset: {
    type: [Number, String],
    default: null
  },
  ariaSetsize: {
    type: [Number, String],
    default: null
  },
  
  // Keyboard navigation
  tabindex: {
    type: [Number, String],
    default: null
  },
  
  // Custom class
  customClass: {
    type: String,
    default: ''
  }
})

defineOptions({
  inheritAttrs: false
})
</script>

<script>
/**
 * AriaHelper Component
 * 
 * A utility component for easily adding ARIA attributes to elements
 * 
 * Example usage:
 * 
 * <AriaHelper 
 *   tag="button"
 *   role="button"
 *   aria-label="Close dialog"
 *   aria-pressed="false"
 *   tabindex="0"
 * >
 *   Close
 * </AriaHelper>
 * 
 * <AriaHelper 
 *   tag="div"
 *   role="alert"
 *   aria-live="assertive"
 *   aria-atomic="true"
 * >
 *   Error message
 * </AriaHelper>
 * 
 * <AriaHelper 
 *   tag="input"
 *   type="text"
 *   aria-label="Search"
 *   aria-invalid="false"
 *   aria-required="true"
 * />
 */
export default {
  name: 'AriaHelper'
}
</script>
