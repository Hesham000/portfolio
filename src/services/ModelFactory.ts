"use client";

import { Base3DModel, Base3DModelProps, ModelFactory } from "@/interfaces/3d-model";

// Factory implementation that follows DIP
// High-level modules depend on this abstraction, not concrete implementations
class ModelFactoryImpl implements ModelFactory {
  private modelRegistry: Map<string, new () => Base3DModel> = new Map();
  
  // Singleton instance
  private static instance: ModelFactoryImpl;
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  // Get singleton instance
  public static getInstance(): ModelFactoryImpl {
    if (!ModelFactoryImpl.instance) {
      ModelFactoryImpl.instance = new ModelFactoryImpl();
    }
    return ModelFactoryImpl.instance;
  }
  
  // Register a model implementation
  public registerModel(type: string, modelClass: new () => Base3DModel): void {
    this.modelRegistry.set(type, modelClass);
  }
  
  // Create a model instance by type
  public createModel(type: string, props: Base3DModelProps): Base3DModel {
    const ModelClass = this.modelRegistry.get(type);
    
    if (!ModelClass) {
      throw new Error(`Model type "${type}" not registered`);
    }
    
    return new ModelClass();
  }
  
  // Get all registered model types
  public getRegisteredModelTypes(): string[] {
    return Array.from(this.modelRegistry.keys());
  }
  
  // Check if a model type is registered
  public hasModelType(type: string): boolean {
    return this.modelRegistry.has(type);
  }
}

// Export singleton instance
export const modelFactory = ModelFactoryImpl.getInstance();

// Higher-level function to use the factory with auto-registration
export function useModel<T extends Base3DModelProps>(
  type: string, 
  modelClass: new () => Base3DModel,
  props?: T
): Base3DModel | null {
  // Register model if not already registered
  if (!modelFactory.hasModelType(type)) {
    modelFactory.registerModel(type, modelClass);
  }
  
  // Create model if type is registered
  if (modelFactory.hasModelType(type)) {
    return modelFactory.createModel(type, props || {});
  }
  
  return null;
}

// Re-export base interface for convenience
export type { Base3DModel, Base3DModelProps }; 