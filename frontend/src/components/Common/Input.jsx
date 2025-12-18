/**
 * Reusable Input component with label and validation
 */

export default function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}) {
  // Special handling for date inputs on mobile
  const isDateInput = props.type === 'date';

  const inputClasses = `
    w-full max-w-full min-h-[48px] text-base
    border rounded-md
    focus:outline-none focus:ring-2 focus:ring-primary-500
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500' : 'border-gray-300'}
    ${isDateInput ? 'px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 text-sm sm:text-base' : 'px-4 py-2.5'}
  `;

  return (
    <div className={`space-y-1 ${className} ${isDateInput ? 'overflow-hidden' : ''}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
