import React from 'react';

/**
 * This component represents various constraint keywords
 * from JSON Schema 2020-12 validation vocabulary.
 */
const Constraint = ({ constraint }) => (
  <span className="json-schema-2020-12__constraint">
    {constraint}
  </span>
);

export default React.memo(Constraint);
