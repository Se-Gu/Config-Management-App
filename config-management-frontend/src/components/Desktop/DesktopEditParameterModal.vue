<template>
  <div class="theme-modal overlay">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Parameter</h5>
          <button type="button" class="btn-close" @click="close">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group mb-3">
            <label for="parameterKey" class="form-label">Parameter Key</label>
            <input
              id="parameterKey"
              type="text"
              class="form-control input-field"
              v-model="parameterKey"
              disabled
            />
          </div>

          <div class="form-group mb-3">
            <label for="value" class="form-label">Default Value</label>
            <input
              id="value"
              type="text"
              class="form-control input-field"
              v-model="value"
              placeholder="Enter default value"
            />
          </div>

          <div class="form-group mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              class="form-control input-field"
              v-model="description"
              placeholder="Enter description"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Country-Specific Configurations</label>
            <div
              v-for="(countryInfo, index) in countrySpecificInformation"
              :key="index"
              class="country-row d-flex align-items-center mb-2"
            >
              <input
                type="text"
                class="form-control me-2"
                v-model="countryInfo.countryName"
                placeholder="Country Code (e.g., TR)"
              />
              <input
                type="text"
                class="form-control me-2"
                v-model="countryInfo.value"
                placeholder="Value"
              />
              <button class="btn delete-btn" @click="removeCountry(index)">
                Remove
              </button>
            </div>
            <div class="d-flex align-items-center mt-2 add-row">
              <input
                type="text"
                class="form-control me-2"
                v-model="newCountry.countryName"
                placeholder="Country Code"
              />
              <input
                type="text"
                class="form-control me-2"
                v-model="newCountry.value"
                placeholder="Value"
              />
              <button class="btn add-btn" @click="addCountry">ADD</button>
            </div>
          </div>
        </div>

        <div class="modal-footer d-flex">
          <button type="button" class="btn cancel-btn" @click="close">
            Cancel
          </button>
          <button type="button" class="btn save-btn" @click="confirmEdit">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useParameterStore } from "../../stores/parameterStore";
import { validateData } from "../../utils";
import { editParameterSchema } from "../../validationSchemas";
import * as Yup from "yup";
import { useToast } from "vue-toastification";

const toast = useToast();

const props = defineProps({
  parameter: {
    type: Object,
    required: true,
  },
  onClose: {
    type: Function,
    required: true,
  },
});

const parameterStore = useParameterStore();

const parameterKey = ref(props.parameter?.parameterKey || "");
const value = ref(props.parameter?.value || "");
const description = ref(props.parameter?.description || "");
const countrySpecificInformation = ref([
  ...props.parameter.countrySpecificInformation,
]);

const newCountry = ref({ countryName: "", value: "" });

const close = () => {
  props.onClose();
};

const addCountry = async () => {
  const formData = {
    countryName: newCountry.value.countryName.trim(),
    value: newCountry.value.value.trim(),
  };

  const countrySchema = Yup.object().shape({
    countryName: Yup.string()
      .trim()
      .required("Country code is required.")
      .max(5, "Country code cannot exceed 5 characters."),
    value: Yup.string()
      .trim()
      .required("Value is required.")
      .max(255, "Value cannot exceed 255 characters."),
  });

  const isValid = await validateData(formData, countrySchema);

  if (!isValid) return;

  if (
    countrySpecificInformation.value.some(
      (info) => info.countryName === formData.countryName
    )
  ) {
    toast.error("This country configuration already exists.");
    return;
  }

  countrySpecificInformation.value.push({ ...formData });
  newCountry.value = { countryName: "", value: "" };
};

const removeCountry = (index: number) => {
  countrySpecificInformation.value.splice(index, 1);
};

const confirmEdit = async () => {
  const formData = {
    key: parameterKey.value,
    value: value.value,
    description: description.value,
    countrySpecificInformation: JSON.parse(
      JSON.stringify(countrySpecificInformation.value)
    ),
  };

  console.log("formData: ", formData);

  const isValid = await validateData(formData, editParameterSchema);
  if (!isValid) return;

  try {
    await parameterStore.createOrUpdateParameter(parameterKey.value, {
      ...props.parameter,
      parameterKey: parameterKey.value,
      value: value.value,
      description: description.value,
      countrySpecificInformation: formData.countrySpecificInformation,
      createdAt: props.parameter.createdAt,
    });

    close();
  } catch (error) {
    console.error("Error updating parameter:", error);
  }
};

onMounted(() => {
  document.body.style.overflow = "hidden";
});
onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.theme-modal .modal-dialog {
  width: 60%;
  max-width: 800px;
  background-color: #252a41;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.theme-modal .modal-content {
  background-color: #252a41;
  color: #d1d5db;
  border-radius: 16px;
  padding: 30px;
  border: 1px solid #3a3f5b;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header .btn-close {
  background: none;
  border: none;
  color: #d1d5db;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease-in-out;
}

.modal-body {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 20px;
}

.modal-footer {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.cancel-btn {
  background-color: transparent;
  color: #9ca3af;
  border: 1px solid #9ca3af;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background-color: #9ca3af;
  color: #252a41;
}

.save-btn {
  background: linear-gradient(to right, #01b1e5, #01d8d1);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.save-btn:hover {
  background: linear-gradient(to right, #019ac9, #00afa9);
}

.input-field {
  background-color: rgba(34, 40, 49, 0.9);
  border: 1px solid #4a4a6a;
  color: white;
  width: 100%;
  padding: 10px 15px;
  border-radius: 6px;
  box-sizing: border-box;
}

.input-field:disabled {
  background-color: rgba(34, 40, 49, 0.9);
}

.input-field:focus {
  border-color: #e14eca;
  box-shadow: 0 0 5px rgba(199, 90, 255, 0.7);
  background-color: rgba(34, 40, 49, 0.9);
  color: white;
}

.input-field::placeholder {
  color: #7f7f7f;
}

textarea.input-field {
  min-height: 120px;
  resize: vertical;
}

.country-row input,
.add-row input {
  background-color: rgba(34, 40, 49, 0.9);
  border: 1px solid #4a4a6a;
  color: white;
  padding: 10px 15px;
  border-radius: 6px;
  box-sizing: border-box;
}

.country-row input:focus,
.add-row input:focus {
  border-color: #e14eca;
  box-shadow: 0 0 5px rgba(199, 90, 255, 0.7);
  background-color: rgba(34, 40, 49, 0.9);
  color: white;
}

.country-row input::placeholder,
.add-row input::placeholder {
  color: #7f7f7f;
}

.add-btn,
.delete-btn {
  min-width: 80px;
  background: linear-gradient(to right, #01b1e5, #01d8d1);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.add-btn:hover,
.delete-btn:hover {
  background: linear-gradient(to right, #019ac9, #00afa9);
}

.add-btn {
  background: linear-gradient(to right, #01b1e5, #01d8d1);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.add-btn:hover {
  background: linear-gradient(to right, #019ac9, #00afa9);
}

.delete-btn {
  background: linear-gradient(to right, #f23d49, #f74c6f);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.delete-btn:hover {
  background: linear-gradient(to right, #d73541, #e2455d);
}
</style>
