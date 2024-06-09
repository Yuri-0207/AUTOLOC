'use client';

import { useState } from "react";

export default function useFocus () {

  const [isFocused, setIsFocused] = useState(false);
  const handleFocusChange = () => setIsFocused(true);
  const handleBlurChange = () => setIsFocused(false);

  return { isFocused, handleFocusChange, handleBlurChange };
}