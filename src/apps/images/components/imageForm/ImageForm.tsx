import React from 'react';
import { useForm, Controller  } from "react-hook-form";
import { Typeahead } from 'react-bootstrap-typeahead';
import RangeSlider from 'react-bootstrap-range-slider';
import {
  ImageFormData,
  Image,
  ImageMode,
  ImageModeOption
} from 'apps/images/models';
import { getImageModeOptions } from 'apps/images/utils';

interface ImageFormProps {
  image: Image;
  disabled: boolean;
  onSubmit: (data: ImageFormData) => void;
}

const validationRules = {
  width: { valueAsNumber: true },
  height: { valueAsNumber: true },
};

const ImageForm: React.FC<ImageFormProps> = ({ image, disabled, onSubmit }) => {
  const {
    handleSubmit,
    register,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const currentMode = watch("mode");

  const isBlurModeSelected = () => (
    currentMode?.find((mode: ImageModeOption) => mode.value === ImageMode.blur.toLowerCase())
  );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col col-6">
            <label htmlFor="width" className="form-label">Width</label>
            <input
              className={`form-control ${errors.width && 'form-input-error'}`}
              placeholder="Width"
              id="width"
              type="number"
              min={1}
              defaultValue={image.width}
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
              defaultValue={image.height}
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
                selected={value || []}
                options={getImageModeOptions()}
                placeholder="Choose image mode"
                labelKey="key"
                highlightOnlyResult
                multiple
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
                  value={value || 1}
                  min={1}
                  max={10}
                  onChange={onChange}
                />
              )}
            />          
          </div>
        )}

        <div className="mt-5">
          <button
            className="btn btn-primary"
            type="submit"
            disabled={disabled}
          >
            Apply changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImageForm;