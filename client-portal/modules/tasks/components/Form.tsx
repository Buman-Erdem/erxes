import * as _ from "lodash";

import { ICustomField, Label, Ticket } from "../../types";
import React, { useState } from "react";

import Alert from "../../utils/Alert";
import Button from "../../common/Button";
import { ControlLabel } from "../../common/form";
import FormControl from "../../common/form/Control";
import FormGroup from "../../common/form/Group";
import { FormWrapper } from "../../styles/main";
import GenerateField from "./GenerateField";

type Props = {
  handleSubmit: (doc: Ticket) => void;
  customFields: any[];
  departments: string[];
  branches: string[];
  products: string[];
  labels: Label[];
};

export default function TaskForm({
  handleSubmit,
  customFields,
  departments,
  branches,
  products,
  labels,
}: Props) {
  const [task, setTask] = useState<Ticket>({} as Ticket);
  const [customFieldsData, setCustomFieldsData] = useState<ICustomField[]>([]);

  const handleClick = () => {
    for (const field of customFields) {
      const customField =
        customFieldsData.find((c) => c.field === field._id) || ({} as any);

      if (field.isRequired) {
        const alert = customField.value;

        if (!alert) {
          return Alert.error("Please enter or choose a required field");
        }
      }
    }

    handleSubmit({ ...task, customFieldsData });
  };

  const onCustomFieldsDataChange = ({ _id, value }) => {
    const field = customFieldsData?.find((c) => c.field === _id);

    const systemField = customFields.find(
      (f) => f._id === _id && f.isDefinedByErxes
    );

    if (systemField) {
      return setTask({
        ...task,
        [systemField.field]: value,
      });
    }

    for (const f of customFields) {
      const logics = f.logics || [];

      if (!logics.length) {
        continue;
      }

      if (
        logics.findIndex((l) => l.fieldId && l.fieldId.includes(_id)) === -1
      ) {
        continue;
      }

      customFieldsData.forEach((c) => {
        if (c.field === f._id) {
          c.value = "";
        }
      });
    }

    if (field) {
      field.value = value;
      setCustomFieldsData(customFieldsData);
    } else {
      setCustomFieldsData([...customFieldsData, { field: _id, value }]);
    }
  };

  function renderControl({ label, name, placeholder, value = "" }) {
    const handleChange = (e) => {
      setTask({
        ...task,
        [name]: e.target.value,
      });
    };

    return (
      <FormGroup>
        <ControlLabel>{label}</ControlLabel>
        <FormControl
          name={name}
          placeholder={placeholder}
          value={value}
          required={true}
          onChange={handleChange}
        />
      </FormGroup>
    );
  }

  function renderCustomFields() {
    return customFields.map((field: any, index: number) => {
      return (
        <GenerateField
          labels={labels}
          key={index}
          field={field}
          onValueChange={onCustomFieldsDataChange}
          departments={departments}
          branches={branches}
          products={products}
          isEditing={true}
        />
      );
    });
  }

  return (
    <FormWrapper>
      <h4>Add a new sales pipeline</h4>
      <div className="content">
        {renderControl({
          name: "subject",
          label: "Subject",
          value: task.subject,
          placeholder: "Enter a subject",
        })}
        {renderControl({
          name: "description",
          label: "Description",
          value: task.description,
          placeholder: "Enter a description",
        })}
        {renderCustomFields()}
        <div className="right">
          <Button
            btnStyle="success"
            onClick={handleClick}
            uppercase={false}
            icon="check-circle"
          >
            Save
          </Button>
        </div>
      </div>
    </FormWrapper>
  );
}
