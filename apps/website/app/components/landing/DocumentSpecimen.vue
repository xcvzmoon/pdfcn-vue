<template>
  <div
    class="document-paper w-full bg-white px-6.5 pt-6 pb-4.5 font-[Arial,sans-serif] text-[8px] leading-[1.5] [color:#24291f] shadow-[3px_5px_0_rgb(0_0_0_/_0.08)] [--document-accent:#2c4131]"
    aria-label="Sample invoice with fictional company names and illustrative values"
  >
    <div
      class="document-brand flex items-center gap-2 text-[8px] font-semibold [&_small]:text-[6px] [&_small]:font-normal"
    >
      <span
        class="document-logo grid h-[25px] w-6 place-items-center text-[22px] font-bold text-white [background:var(--document-accent)]"
        >f.</span
      ><span>FORM & FIELD<br /><small>Independent design studio</small></span
      ><span class="document-label ml-auto text-right font-mono text-[6px] font-normal"
        >SAMPLE INVOICE<br />№ 2026—042</span
      >
    </div>
    <div
      class="document-heading flex items-end justify-between border-b border-current px-0 pt-6.5 pb-5 [&_h2]:text-[35px] [&_h2]:leading-[0.98] [&_h2]:font-medium [&_h2]:tracking-[-0.04em] [&_h2]:[color:var(--document-accent)]"
    >
      <h2>Good work.<br />On paper.</h2>
      <span
        class="document-stamp px-[7px] py-[3px] text-[6px] tracking-[0.08em] [color:var(--document-accent)] [border:1px_solid_var(--document-accent)]"
        >PAID</span
      >
    </div>
    <div
      class="document-parties grid grid-cols-2 gap-3 py-[17px] [&_>_:last-child]:text-right [&_p]:mt-[3px] [&_p]:text-[7px] [&_p]:font-semibold [&_small]:font-mono [&_small]:text-[5px] [&_small]:tracking-[0.08em] [&_small]:opacity-[0.75] [&_span]:text-[6px] [&_span]:opacity-[0.7]"
    >
      <div>
        <small>PREPARED FOR</small>
        <p>Northstar Studio</p>
        <span>48 Design Avenue<br />Portland, OR 97205</span>
      </div>
      <div>
        <small>ISSUED</small>
        <p>September 01, 2026</p>
        <small>DUE DATE</small>
        <p>September 30, 2026</p>
      </div>
    </div>
    <div class="document-table">
      <div
        class="document-row document-table-head grid grid-cols-[1fr_25px_60px] border-y border-current px-0 py-[7px] py-[9px] font-mono text-[5px] [border-bottom:1px_solid_#e1e3db] [&_>_:not(:first-child)]:text-right"
      >
        <span>DESCRIPTION</span><span>QTY</span><span>AMOUNT</span>
      </div>
      <div
        class="document-row grid grid-cols-[1fr_25px_60px] px-0 py-[9px] text-[6px] [border-bottom:1px_solid_#e1e3db] [&_>_:not(:first-child)]:text-right"
      >
        <span>Brand identity system</span><span>1</span><span>$2,400.00</span>
      </div>
      <div
        class="document-row grid grid-cols-[1fr_25px_60px] px-0 py-[9px] text-[6px] [border-bottom:1px_solid_#e1e3db] [&_>_:not(:first-child)]:text-right"
      >
        <span>Website design</span><span>1</span><span>$3,200.00</span>
      </div>
      <div
        class="document-row grid grid-cols-[1fr_25px_60px] px-0 py-[9px] text-[6px] [border-bottom:1px_solid_#e1e3db] [&_>_:not(:first-child)]:text-right"
      >
        <span>Design documentation</span><span>1</span><span>$800.00</span>
      </div>
    </div>
    <div
      class="document-total flex items-baseline justify-between px-0 py-[15px] [&_span]:text-[7px] [&_strong]:text-[22px] [&_strong]:tracking-[-0.04em] [&_strong]:[color:var(--document-accent)]"
    >
      <span>Total due</span><strong>$6,400.00</strong>
    </div>
    <div
      class="document-notes [padding-block:11px_22px] [&_p]:mt-[5px] [&_p]:text-[6px] [&_small]:font-mono [&_small]:text-[5px] [&_small]:tracking-[0.08em] [&_small]:opacity-[0.75]"
    >
      <small>A NOTE FROM THE STUDIO</small>
      <p>
        Thank you for trusting us with your next chapter.<br />Here's to making something that
        matters.
      </p>
    </div>
    <div class="document-footer flex justify-between border-t border-current pt-2 text-[5px]">
      <span>hello@formandfield.example</span><span>01 / 01</span>
    </div>
  </div>
</template>
