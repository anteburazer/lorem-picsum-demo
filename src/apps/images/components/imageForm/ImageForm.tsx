import React from 'react';
import { useForm, Controller } from "react-hook-form";
import { Typeahead } from 'react-bootstrap-typeahead';
import RangeSlider from 'react-bootstrap-range-slider';
import {
  ImageFormData,
  ImageMode,
  ImageModeOption,
  ImageSettings
} from 'apps/images/models';
import { getImageModeOptions } from 'apps/images/utils';

interface ImageFormProps {
  imageSettings: ImageSettings;
  disabled: boolean;
  onSubmit: (data: ImageFormData) => void;
}

const validationRules = {
  width: { valueAsNumber: true },
  height: { valueAsNumber: true },
};

const ImageForm: React.FC<ImageFormProps> = ({ imageSettings, disabled, onSubmit }) => {
  const {
    handleSubmit,
    register,
    watch,
    getValues,
    control,
    formState: { isDirty, errors, dirtyFields },
  } = useForm({mode: 'all'});

  const currentMode = watch("mode");

  const isBlurModeSelected = () => {
    const bluredByDefault = imageSettings.mode.find((mode) => mode === ImageMode.blur);
    const isCurrentModeSelected = currentMode?.find((mode: ImageModeOption) => mode.value === ImageMode.blur);
    const values = getValues();

    return isCurrentModeSelected || (!isDirty && bluredByDefault) || values.blurValue
      ? true
      : false
  };

  const submit = (data: ImageFormData) => {
    const formData: ImageFormData = {
      ...data,
      mode: dirtyFields.mode ? (data.mode as Array<any>) : imageSettings.mode.map(value => ({ key: value, value })),
      blurValue: dirtyFields.blurValue ? data.blurValue : imageSettings.blurValue
    };

    onSubmit(formData);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(submit)}>
        <div className="row">
          <div className="col col-6">
            <label htmlFor="width" className="form-label">Width</label>
            <input
              className={`form-control ${errors.width && 'form-input-error'}`}
              placeholder="Width"
              id="width"
              type="number"
              min={1}
              disabled={disabled}
              defaultValue={imageSettings.width}
              {...register("width", { ...validationRules.width })}
            />

            <div className="form-error-label mt-2 pl-2">
              {errors.width && errors.width.message}
            </div>
          </div>

          <div className="col col-6">
            <label htmlFor="height" className="form-label">Height</label>
            <input
              className={`form-control ${errors.width && 'form-input-error'}`}
              placeholder="Height"
              id="height"
              type="number"
              min={1}
              disabled={disabled}
              defaultValue={imageSettings.height}
              {...register("height", { ...validationRules.height })}
            />

            <div className="form-error-label mt-2 pl-2">
              {errors.height && errors.height.message}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <label htmlFor="mode" className="form-label">Image mode</label>
          <Controller
            control={control}
            name="mode"
            render={({
              field: { onChange, value }
            }) => (
              <Typeahead
                id="mode"
                onChange={onChange}
                selected={value || imageSettings.mode.map(mode => ({ key: mode, value: mode }))}
                options={getImageModeOptions()}
                placeholder="Choose image mode"
                labelKey="key"
                highlightOnlyResult
                multiple
                disabled={disabled}
              />
            )}
          />
        </div>

        {isBlurModeSelected() && (
          <div className="mt-4">
            <label htmlFor="blurValue" className="form-label">Blur value</label>
            <Controller
              control={control}
              name="blurValue"
              render={({
                field: { onChange, value }
              }) => (
                <RangeSlider
                  id="blurValue"
                  className="w-100"
                  value={value || imageSettings.blurValue}
                  min={1}
                  max={10}
                  onChange={onChange}
                  disabled={disabled}
                />
              )}
            />          
          </div>
        )}

        <div className="mt-5">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={disabled || !isDirty}
          >
            Apply changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;