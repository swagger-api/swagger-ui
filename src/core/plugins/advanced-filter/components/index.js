/* eslint-disable camelcase */
import { MatcherOption_matchCase } from "./matcher-options/matcher-option_matchCase"
import { MatcherOption_matchWholeWord } from "./matcher-options/matcher-option_matchWholeWord"
import { AdvancedFilter } from "./advanced-filter"
import { MatcherOptionSimpleButton } from "./matcher-options/matcher-option-simple-button"
import {
  MatcherSelectOption, MatcherSelectOption_definitions,
  MatcherSelectOption_operations,
  MatcherSelectOption_tags,
} from "./matcher/operations-select-option"
import { AdvancedFilterOptions } from "./advanced-filter-options"
import { MatcherMultiSelect } from "./matcher/matcher-multi-select"

export default {
  MatcherOptionSimpleButton,
  MatcherOption_matchCase,
  MatcherOption_matchWholeWord,
  MatcherMultiSelect,
  MatcherSelectOption,
  MatcherSelectOption_operations,
  MatcherSelectOption_tags,
  MatcherSelectOption_definitions,
  AdvancedFilterOptions,
  AdvancedFilter,
}
