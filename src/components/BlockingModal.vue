<template>
  <div
    class="modal-backdrop fade show d-block"
    style="
      background: rgba(0, 0, 0, 0.5);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    "
    aria-modal="true"
  >
    <div
      class="modal-dialog modal-dialog-centered"
      role="document"
      style="pointer-events: none"
    >
      <div class="modal-content" style="pointer-events: auto">
        <div class="modal-header">
          <h5 class="modal-title">Please wait.</h5>
        </div>
        <div class="modal-body">...</div>
      </div>
    </div>
  </div>
</template>
