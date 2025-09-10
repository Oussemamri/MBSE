import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Create axios instance with auth header
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Block {
  id: string;
  name: string;
  description: string | null;
  type: BlockType;
  modelId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: Block;
  children?: Block[];
}

export type BlockType = 'COMPONENT' | 'SUBSYSTEM' | 'FUNCTION';

export interface CreateBlockData {
  name: string;
  description?: string;
  type: BlockType;
  modelId: string;
  parentId?: string;
}

export interface UpdateBlockData {
  name?: string;
  description?: string;
  type?: BlockType;
  parentId?: string;
}

class BlockService {
  private baseURL = '/blocks';

  /**
   * Get all blocks for a model
   */
  async getModelBlocks(modelId: string): Promise<Block[]> {
    try {
      const response = await api.get(`${this.baseURL}/${modelId}`);
      return response.data.blocks;
    } catch (error) {
      console.error('Error fetching model blocks:', error);
      throw error;
    }
  }

  /**
   * Create a new block
   */
  async createBlock(blockData: CreateBlockData): Promise<Block> {
    try {
      const response = await api.post(this.baseURL, blockData);
      return response.data.block;
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  }

  /**
   * Update an existing block
   */
  async updateBlock(blockId: string, blockData: UpdateBlockData): Promise<Block> {
    try {
      const response = await api.put(`${this.baseURL}/${blockId}`, blockData);
      return response.data.block;
    } catch (error) {
      console.error('Error updating block:', error);
      throw error;
    }
  }

  /**
   * Delete a block
   */
  async deleteBlock(blockId: string): Promise<void> {
    try {
      await api.delete(`${this.baseURL}/${blockId}`);
    } catch (error) {
      console.error('Error deleting block:', error);
      throw error;
    }
  }

  /**
   * Get block hierarchy - organize blocks into a tree structure
   */
  buildBlockHierarchy(blocks: Block[]): Block[] {
    const blockMap = new Map<string, Block>();
    const rootBlocks: Block[] = [];

    // Create a map of all blocks
    blocks.forEach(block => {
      blockMap.set(block.id, { ...block, children: [] });
    });

    // Build the hierarchy
    blocks.forEach(block => {
      const blockWithChildren = blockMap.get(block.id)!;

      if (block.parentId) {
        const parent = blockMap.get(block.parentId);
        if (parent) {
          parent.children = parent.children || [];
          parent.children.push(blockWithChildren);
          blockWithChildren.parent = parent;
        }
      } else {
        rootBlocks.push(blockWithChildren);
      }
    });

    return rootBlocks;
  }

  /**
   * Get all descendants of a block (children, grandchildren, etc.)
   */
  getBlockDescendants(block: Block): Block[] {
    const descendants: Block[] = [];

    const collectDescendants = (currentBlock: Block) => {
      if (currentBlock.children) {
        currentBlock.children.forEach(child => {
          descendants.push(child);
          collectDescendants(child);
        });
      }
    };

    collectDescendants(block);
    return descendants;
  }

  /**
   * Get all ancestors of a block (parent, grandparent, etc.)
   */
  getBlockAncestors(block: Block): Block[] {
    const ancestors: Block[] = [];
    let current = block.parent;

    while (current) {
      ancestors.unshift(current);
      current = current.parent;
    }

    return ancestors;
  }

  /**
   * Check if moving a block would create a circular reference
   */
  wouldCreateCircularReference(blockId: string, newParentId: string, blocks: Block[]): boolean {
    const targetBlock = blocks.find(b => b.id === blockId);
    if (!targetBlock) return false;

    // Check if the new parent is a descendant of the block
    const descendants = this.getBlockDescendants(targetBlock);
    return descendants.some(descendant => descendant.id === newParentId);
  }
}

export default new BlockService();
