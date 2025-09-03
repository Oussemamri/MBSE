import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middlewares/auth';

const prisma = new PrismaClient();

// GET /export/json/:modelId - Export model as JSON
export const exportModelJson = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the model and verify access (owner or shared)
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId },
          {
            shares: {
              some: { userId }
            }
          }
        ]
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requirements: {
          select: {
            id: true,
            title: true,
            description: true,
            priority: true,
            status: true,
            createdAt: true
          }
        },
        links: {
          include: {
            requirement: {
              select: {
                id: true,
                title: true,
                description: true,
                priority: true,
                status: true
              }
            }
          }
        }
      }
    });

    if (!model) {
      return res.status(404).json({ message: 'Model not found or access denied' });
    }

    // Create export data structure
    const exportData = {
      metadata: {
        exportVersion: '1.0',
        exportedAt: new Date().toISOString(),
        exportedBy: req.user?.email,
        modelId: model.id,
        modelName: model.name,
        modelDescription: model.description,
        originalAuthor: model.user.name || model.user.email,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
      },
      diagram: {
        name: model.name,
        description: model.description,
        diagramData: model.diagramData
      },
      requirements: model.requirements,
      links: model.links.map(link => ({
        id: link.id,
        blockId: link.blockId,
        modelId: link.modelId,
        requirement: link.requirement,
        createdAt: link.createdAt
      }))
    };

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${model.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.json"`);

    res.json(exportData);
  } catch (error) {
    console.error('Export JSON error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /export/xmi/:modelId - Export model as SysML XMI
export const exportModelXmi = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find the model and verify access
    const model = await prisma.model.findFirst({
      where: {
        id: modelId,
        OR: [
          { userId },
          {
            shares: {
              some: { userId }
            }
          }
        ]
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requirements: true,
        links: {
          include: {
            requirement: true
          }
        }
      }
    });

    if (!model) {
      return res.status(404).json({ message: 'Model not found or access denied' });
    }

    // Generate SysML XMI structure
    const xmiContent = generateSysMLXMI(model);

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="${model.name.replace(/[^a-zA-Z0-9]/g, '_')}_export.xmi"`);

    res.send(xmiContent);
  } catch (error) {
    console.error('Export XMI error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /import/json - Import model from JSON
export const importModelJson = async (req: AuthRequest, res: Response) => {
  try {
    const { importData, modelName } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!importData || !modelName) {
      return res.status(400).json({ message: 'Import data and model name are required' });
    }

    // Validate import data structure
    if (!importData.diagram || !importData.diagram.diagramData) {
      return res.status(400).json({ message: 'Invalid import data format' });
    }

    // Create new model with imported data
    const newModel = await prisma.model.create({
      data: {
        name: modelName,
        description: importData.diagram.description || `Imported from ${importData.metadata?.modelName || 'external source'}`,
        diagramData: importData.diagram.diagramData,
        userId
      }
    });

    // Import requirements if they exist
    if (importData.requirements && Array.isArray(importData.requirements)) {
      const requirementMappings: { [oldId: string]: string } = {};

      for (const req of importData.requirements) {
        const newRequirement = await prisma.requirement.create({
          data: {
            title: req.title,
            description: req.description,
            priority: req.priority || 'medium',
            status: req.status || 'open',
            userId,
            modelId: newModel.id
          }
        });
        requirementMappings[req.id] = newRequirement.id;
      }

      // Import links if they exist
      if (importData.links && Array.isArray(importData.links)) {
        for (const link of importData.links) {
          const newRequirementId = requirementMappings[link.requirement.id];
          if (newRequirementId) {
            await prisma.link.create({
              data: {
                blockId: link.blockId,
                modelId: newModel.id,
                requirementId: newRequirementId
              }
            });
          }
        }
      }
    }

    // Fetch the complete imported model
    const importedModel = await prisma.model.findUnique({
      where: { id: newModel.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        requirements: true,
        links: {
          include: {
            requirement: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Model imported successfully',
      model: importedModel
    });
  } catch (error) {
    console.error('Import JSON error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Helper function to generate SysML XMI content
function generateSysMLXMI(model: any): string {
  const timestamp = new Date().toISOString();
  const modelId = model.id;
  const modelName = model.name.replace(/[<>&"']/g, ' '); // Escape XML characters

  // Extract blocks from diagram data
  const blocks: any[] = [];
  if (model.diagramData && model.diagramData.cells) {
    model.diagramData.cells.forEach((cell: any) => {
      if (cell.type && cell.type.includes('Rectangle')) {
        blocks.push({
          id: cell.id,
          name: cell.attrs?.label?.text || 'Unnamed Block',
          description: cell.description || '',
          x: cell.position?.x || 0,
          y: cell.position?.y || 0
        });
      }
    });
  }

  // Generate XMI content
  const xmiContent = `<?xml version="1.0" encoding="UTF-8"?>
<xmi:XMI xmi:version="2.0" xmlns:xmi="http://www.omg.org/XMI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:sysml="http://www.eclipse.org/papyrus/sysml/1.6/SysML" xmlns:uml="http://www.eclipse.org/uml2/5.0.0/UML">
  <uml:Model xmi:id="${modelId}" name="${modelName}">
    <packagedElement xmi:type="uml:Package" xmi:id="${modelId}_pkg" name="${modelName}_Package">
      
      <!-- System Block Definition -->
      ${blocks.map((block, index) => `
      <packagedElement xmi:type="uml:Class" xmi:id="${block.id}" name="${block.name}">
        <ownedComment xmi:id="${block.id}_comment" body="${block.description}"/>
        <appliedStereotype xmi:type="sysml:blocks:Block" xmi:id="${block.id}_block"/>
      </packagedElement>`).join('')}
      
      <!-- Requirements -->
      ${model.requirements.map((req: any, index: number) => `
      <packagedElement xmi:type="uml:Class" xmi:id="${req.id}" name="${req.title.replace(/[<>&"']/g, ' ')}">
        <ownedComment xmi:id="${req.id}_comment" body="${(req.description || '').replace(/[<>&"']/g, ' ')}"/>
        <appliedStereotype xmi:type="sysml:requirements:Requirement" xmi:id="${req.id}_req">
          <text>${req.description || ''}</text>
          <id>${req.id}</id>
        </appliedStereotype>
        <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="${req.id}_priority" name="priority" literal="${req.priority}"/>
        <ownedLiteral xmi:type="uml:EnumerationLiteral" xmi:id="${req.id}_status" name="status" literal="${req.status}"/>
      </packagedElement>`).join('')}
      
      <!-- Traceability Links -->
      ${model.links.map((link: any, index: number) => `
      <packagedElement xmi:type="uml:Dependency" xmi:id="${link.id}" name="trace_${index}">
        <client xmi:idref="${link.blockId}"/>
        <supplier xmi:idref="${link.requirementId}"/>
        <appliedStereotype xmi:type="sysml:requirements:Trace" xmi:id="${link.id}_trace"/>
      </packagedElement>`).join('')}
      
    </packagedElement>
  </uml:Model>
  
  <!-- Metadata -->
  <sysml:blocks:BlockDefinition xmi:id="${modelId}_blockdef" name="${modelName}_Definition">
    <documentation>Exported from MBSE Tool on ${timestamp}</documentation>
    <author>${model.user.name || model.user.email}</author>
    <version>1.0</version>
  </sysml:blocks:BlockDefinition>
  
</xmi:XMI>`;

  return xmiContent;
}
