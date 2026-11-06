/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"

import { schema } from "../../../prop-types"
import { useFn } from "../../../hooks"
import type { KeywordProps } from "../../../types"

/**
 * `.json-schema-2020-12__title` (headline text) and
 * `.json-schema-2020-12__title .json-schema-2020-12-keyword__name` (a keyword
 * name passed as `title` loses its margin). The code-text variant inside a
 * property, the required `*` and the pattern `/…/` are applied by ancestors
 * through the `data-json-schema-title` hook (see `styles.ts`).
 */
const TITLE =
  "sui:inline-block sui:font-[family-name:sans-serif] sui:font-bold sui:text-[12px] sui:leading-[normal] sui:text-json-schema-title sui:dark:text-json-schema-dark-text sui:[&_span]:m-0"

export interface TitleProps extends KeywordProps {
  title?: string | React.ReactElement
}

const Title = ({ title = "", schema }: TitleProps) => {
  const fn = useFn()
  const renderedTitle = title || fn.getTitle(schema)

  if (!renderedTitle) return null

  return (
    <strong className={TITLE} data-keyword="title" data-json-schema-title="">
      {renderedTitle}
    </strong>
  )
}

Title.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  schema: schema.isRequired,
}

export default Title
